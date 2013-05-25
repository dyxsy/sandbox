class RpcController < ApplicationController

  def add
    mp_client = MessagePack::RPC::Client.new('127.0.0.1', 8884)
    @rpc_result = mp_client.call(:ninja, :add, params[:a].to_i, params[:b].to_i)
  end

end
