# encoding: utf-8
class WebsocketsRailsController < WebsocketRails::BaseController
  def send_msg
      t = Time.now
      time = t.strftime("%Y-%m-%d %H:%M:%S")
      msgs = [message['name'], message['msg'], time]
      # send_message :msg, msgs, :namespace => :send_msg
      WebsocketRails[:subscribe_msg].trigger(:msg, msgs)
  end
end