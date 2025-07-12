/**
 * @fileoverview Miscellaneous Utilities - Collection of shared utility functions and hooks
 * 
 * ==================================================================================
 * UTILITY COLLECTION OVERVIEW
 * ==================================================================================
 * 
 * This module contains a comprehensive collection of utility functions and custom
 * React hooks used throughout the Vitae application. Includes styling utilities,
 * image handling, state management hooks, and form interaction helpers.
 * 
 * KEY UTILITIES:
 * 1. CSS class merging and conditional styling (cn function)
 * 2. Image source generation for user avatars and content
 * 3. Hydration detection for SSR compatibility
 * 4. Form submission state management
 * 5. Loading state delays and optimistic UI patterns
 * 
 * PERFORMANCE FEATURES:
 * - Spin delay for preventing loading flicker
 * - Optimistic UI updates during form submissions
 * - Efficient class name merging with Tailwind CSS
 * - Image optimization endpoint integration
 * 
 * SSR COMPATIBILITY:
 * - useHydrated hook for client-side only rendering
 * - Safe client-side state initialization
 * - Prevention of hydration mismatches
 * 
 * @version 1.0.0
 * @author Vitae Development Team
 * @since 1.0.0
 * @requires clsx
 * @requires openimg/react
 * @requires react
 * @requires react-router
 * @requires spin-delay
 * @requires tailwind-merge
 * 
 * @example
 * ```tsx
 * // CSS class merging
 * const className = cn('base-class', condition && 'conditional-class')
 * 
 * // Hydration detection
 * const hydrated = useHydrated()
 * 
 * // Image source generation
 * const avatarSrc = getUserImgSrc(user.imageKey)
 * 
 * // Form submission state
 * const isPending = useIsPending()
 * ```
 * 
 * @see {@link app/components/client-only.tsx} for useHydrated usage
 */

import { clsx, type ClassValue } from 'clsx'
import { type GetSrcArgs, defaultGetSrc } from 'openimg/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormAction, useNavigation } from 'react-router'
import { useSpinDelay } from 'spin-delay'
import { twMerge } from 'tailwind-merge'

export function getUserImgSrc(objectKey?: string | null) {
	return objectKey
		? `/resources/images?objectKey=${encodeURIComponent(objectKey)}`
		: '/img/user.png'
}

export function getNoteImgSrc(objectKey: string) {
	return `/resources/images?objectKey=${encodeURIComponent(objectKey)}`
}

export function getImgSrc({
	height,
	optimizerEndpoint,
	src,
	width,
	fit,
	format,
}: GetSrcArgs) {
	// We customize getImgSrc so our src looks nice like this:
	// /resources/images?objectKey=...&h=...&w=...&fit=...&format=...
	// instead of this:
	// /resources/images?src=%2Fresources%2Fimages%3FobjectKey%3D...%26w%3D...%26h%3D...
	if (src.startsWith(optimizerEndpoint)) {
		const [endpoint, query] = src.split('?')
		const searchParams = new URLSearchParams(query)
		searchParams.set('h', height.toString())
		searchParams.set('w', width.toString())
		if (fit) {
			searchParams.set('fit', fit)
		}
		if (format) {
			searchParams.set('format', format)
		}
		return `${endpoint}?${searchParams.toString()}`
	}
	return defaultGetSrc({ height, optimizerEndpoint, src, width, fit, format })
}

export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message
	}
	console.error('Unable to get error message for error', error)
	return 'Unknown Error'
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getDomainUrl(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ??
		request.headers.get('host') ??
		new URL(request.url).host
	const protocol = request.headers.get('X-Forwarded-Proto') ?? 'http'
	return `${protocol}://${host}`
}

export function getReferrerRoute(request: Request) {
	// spelling errors and whatever makes this annoyingly inconsistent
	// in my own testing, `referer` returned the right value, but 🤷‍♂️
	const referrer =
		request.headers.get('referer') ??
		request.headers.get('referrer') ??
		request.referrer
	const domain = getDomainUrl(request)
	if (referrer?.startsWith(domain)) {
		return referrer.slice(domain.length)
	} else {
		return '/'
	}
}

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
	...headers: Array<ResponseInit['headers'] | null | undefined>
) {
	const merged = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers(header).entries()) {
			merged.set(key, value)
		}
	}
	return merged
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
	...headers: Array<ResponseInit['headers'] | null | undefined>
) {
	const combined = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value)
		}
	}
	return combined
}

/**
 * Combine multiple response init objects into one (uses combineHeaders)
 */
export function combineResponseInits(
	...responseInits: Array<ResponseInit | null | undefined>
) {
	let combined: ResponseInit = {}
	for (const responseInit of responseInits) {
		combined = {
			...responseInit,
			headers: combineHeaders(combined.headers, responseInit?.headers),
		}
	}
	return combined
}

/**
 * Returns true if the current navigation is submitting the current route's
 * form. Defaults to the current route's form action and method POST.
 *
 * Defaults state to 'non-idle'
 *
 * NOTE: the default formAction will include query params, but the
 * navigation.formAction will not, so don't use the default formAction if you
 * want to know if a form is submitting without specific query params.
 */
export function useIsPending({
	formAction,
	formMethod = 'POST',
	state = 'non-idle',
}: {
	formAction?: string
	formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
	state?: 'submitting' | 'loading' | 'non-idle'
} = {}) {
	const contextualFormAction = useFormAction()
	const navigation = useNavigation()
	const isPendingState =
		state === 'non-idle'
			? navigation.state !== 'idle'
			: navigation.state === state
	return (
		isPendingState &&
		navigation.formAction === (formAction ?? contextualFormAction) &&
		navigation.formMethod === formMethod
	)
}

/**
 * This combines useSpinDelay (from https://npm.im/spin-delay) and useIsPending
 * from our own utilities to give you a nice way to show a loading spinner for
 * a minimum amount of time, even if the request finishes right after the delay.
 *
 * This avoids a flash of loading state regardless of how fast or slow the
 * request is.
 */
export function useDelayedIsPending({
	formAction,
	formMethod,
	delay = 400,
	minDuration = 300,
}: Parameters<typeof useIsPending>[0] &
	Parameters<typeof useSpinDelay>[1] = {}) {
	const isPending = useIsPending({ formAction, formMethod })
	const delayedIsPending = useSpinDelay(isPending, {
		delay,
		minDuration,
	})
	return delayedIsPending
}

function callAll<Args extends Array<unknown>>(
	...fns: Array<((...args: Args) => unknown) | undefined>
) {
	return (...args: Args) => fns.forEach((fn) => fn?.(...args))
}

/**
 * Use this hook with a button and it will make it so the first click sets a
 * `doubleCheck` state to true, and the second click will actually trigger the
 * `onClick` handler. This allows you to have a button that can be like a
 * "are you sure?" experience for the user before doing destructive operations.
 */
export function useDoubleCheck() {
	const [doubleCheck, setDoubleCheck] = useState(false)

	function getButtonProps(
		props?: React.ButtonHTMLAttributes<HTMLButtonElement>,
	) {
		const onBlur: React.ButtonHTMLAttributes<HTMLButtonElement>['onBlur'] =
			() => setDoubleCheck(false)

		const onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'] =
			doubleCheck
				? undefined
				: (e) => {
						e.preventDefault()
						setDoubleCheck(true)
					}

		const onKeyUp: React.ButtonHTMLAttributes<HTMLButtonElement>['onKeyUp'] = (
			e,
		) => {
			if (e.key === 'Escape') {
				setDoubleCheck(false)
			}
		}

		return {
			...props,
			onBlur: callAll(onBlur, props?.onBlur),
			onClick: callAll(onClick, props?.onClick),
			onKeyUp: callAll(onKeyUp, props?.onKeyUp),
		}
	}

	return { doubleCheck, getButtonProps }
}

/**
 * Simple debounce implementation
 */
function debounce<Callback extends (...args: Parameters<Callback>) => void>(
	fn: Callback,
	delay: number,
) {
	let timer: ReturnType<typeof setTimeout> | null = null
	return (...args: Parameters<Callback>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}

/**
 * Debounce a callback function
 */
export function useDebounce<
	Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
	const callbackRef = useRef(callback)
	useEffect(() => {
		callbackRef.current = callback
	})
	return useMemo(
		() =>
			debounce(
				(...args: Parameters<Callback>) => callbackRef.current(...args),
				delay,
			),
		[delay],
	)
}

export async function downloadFile(url: string, retries: number = 0) {
	const MAX_RETRIES = 3
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch image with status ${response.status}`)
		}
		const contentType = response.headers.get('content-type') ?? 'image/jpg'
		const arrayBuffer = await response.arrayBuffer()
		const file = new File([arrayBuffer], 'downloaded-file', {
			type: contentType,
		})
		return file
	} catch (e) {
		if (retries > MAX_RETRIES) throw e
		return downloadFile(url, retries + 1)
	}
}

/**
 * Hook to check if the component is hydrated (client-side rendered)
 */
export function useHydrated() {
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])
	return hydrated
}
