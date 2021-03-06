export const DEFAULT_HOST = 'localhost'
export const DEFAULT_PORT = 80
export const HEADER_TRACE_ID = 'x-trace-id'
export const QUERY_TRACE_ID = 'traceId'
export const HEADER_SPAN_ID = 'x-span-id'
export const INSTANCE_UNKNOWN = 'unknown'
export const HOST_UNKNOWN = 'UnknownHost'
export const TABLE_UNKNOWN = 'UnknownTable'
export const OPERATION_UNKNOWN = 'other'

export const NORMAL_TRACE = 'normal'
export const SLOW_TRACE = 'slow'
export const TIMEOUT_TRACE = 'time_out'
export const ERROR_TRACE = 'error'
export const TRACER_TIMEOUT = 30 * 1000
export const CURRENT_SPAN = Symbol('CURRENT_SPAN')
export const SKIP_RATE = Symbol('SKIP_RATE')
