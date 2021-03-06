import * as http from 'http'
import {Patcher} from './Patcher'
import {HEADER_TRACE_ID} from '../util/Constants'
import {getRandom64} from '../util/TraceUtil'
import {extractPath} from '../util/Utils'
import {query} from '../util/QueryParser'
import {wrap} from '../trace/Shimmer'
import {Tracer} from '../trace/Tracer'
import {createNamespace} from 'cls-hooked'

export class HttpServerPatcher extends Patcher {

  constructor (options = {}) {
    super(options)
  }

  getModule (): any {
    return http
  }

  getModuleName (): string {
    return 'httpServer'
  }

  getTraceId (req) {
    return req.headers[HEADER_TRACE_ID] || getRandom64()
  }

  buildRequestTags (req) {
    return {
      'http.method': {
        value: req.method.toUpperCase(),
        type: 'string'
      },
      'http.url': {
        value: extractPath(req.url),
        type: 'string'
      },
      'http.query': {
        value: query(req),
        type: 'object'
      }
    }
  }

  buildResponseTags (req) {
    return {}
  }

  createSpan (tracer, tags) {
    const span = tracer.startSpan('http-server', {
      traceId: tracer.traceId
    })

    span.addTags(tags)

    return span
  }

  requestFilter (req) {
    return false
  }

  createTracer (req): Tracer {
    const traceId = this.getTraceId(req)
    return this.getTraceManager().create({traceId})
  }

  shimmer () {
    const self = this
    const traceManager = this.getTraceManager()

    wrap(this.getModule(), 'createServer', function wrapCreateServer (createServer) {
      return function wrappedCreateServer (this: any, requestListener) {
        if (requestListener) {
          const listener = traceManager.bind(function (req, res) {
            if (self.requestFilter(req)) {
              return requestListener(req, res)
            }
            traceManager.bindEmitter(req)
            traceManager.bindEmitter(res)

            const tracer = self.createTracer(req)
            const tags = self.buildRequestTags(req)
            const span = self.createSpan(tracer, tags)

            tracer.named(`HTTP-${tags['http.method'].value}:${tags['http.url'].value}`)
            tracer.setCurrentSpan(span)

            res.once('finish', () => {
              // self.buildResponseTags(res)
              span.finish()
              tracer.finish()
            })
            return requestListener(req, res)
          })

          return createServer.call(this, listener)
        }
        return createServer.call(this, requestListener)
      }
    })
  }

}
