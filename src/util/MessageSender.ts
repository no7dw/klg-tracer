export class MessageSender {

  static MESSAGE_KEY_PREFIX = 'KLG_PROCESS_MESSAGE_'

  client: {
    on (msg: string, reply: (data?) => {}),
    once (msg: string, reply: (data?) => {}),
    emit (messageKey: string, messageData: any)
  } = process

  /**
   * send message by process
   * @param categoryKey like logger,trace...
   * @param args
   */
  send (categoryKey, args: any) {
    this.client.emit(`${MessageSender.MESSAGE_KEY_PREFIX}${categoryKey}`, args)
  }

  on (categoryKey, reply) {
    this.client.on(`${MessageSender.MESSAGE_KEY_PREFIX}${categoryKey}`, reply)
  }

  once (categoryKey, reply) {
    this.client.once(`${MessageSender.MESSAGE_KEY_PREFIX}${categoryKey}`, reply)
  }
}

export const MessageConstants = {
  LOGGER: 'LOGGER',
  TRACE: 'TRACE',
  TRACENODE: 'TRACENODE'
}
