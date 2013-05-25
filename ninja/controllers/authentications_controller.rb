# encoding: utf-8
class AuthenticationsController < ApplicationController
  include SimpleCaptcha::ControllerHelpers
  #----------------------------------------------------------------------------
  def new
    @authentication = Authentication.new
  end

  #----------------------------------------------------------------------------
  def show
    redirect_to login_url
  end

  def create
    Authentication.authenticate_with = User
    if simple_captcha_valid?
      begin
        login    = params[:authentication][:login]
        password = params[:authentication][:password]
        mp_client = MessagePack::RPC::Client.new(Ninja::Constants::RPC_HOST, Ninja::Constants::RPC_PORT)
        rpc_result = mp_client.call(:cheetah_admin, :web_login, login, password)
        if rpc_result.first == Ninja::Constants::MP_RPC_OK
          user = User.where(:login => login).first
          session[:current_user] = user
           session[:current_user] = {:uid => rpc_result.last[0],
                                     :login => login, 
                                     :token => rpc_result.last[2]}
          @authentication = Authentication.new(params[:authentication], true)
          @authentication.save
          result = { :success          => true,
                      :msg              => '登录成功！',
                      :login            => login,
                      :uid              => rpc_result.last[0]}
        else 
          result = { :success => false, :msg => rpc_result.last }
        end
      rescue StandardError => e
        result = { :success => false, :msg => e.message }
      end
    else
      result = { :success => false, :msg => '验证码输入错误'}
    end
    respond_to do |format|
      format.json { render :json => result }
    end
  end

  # The login form gets submitted to :update action when @authentication is
  # saved (@authentication != nil) but the user is suspended.
  #----------------------------------------------------------------------------
  alias :update :create

  #----------------------------------------------------------------------------
  def destroy
    begin
      login = current_user.login
      mp_client = MessagePack::RPC::Client.new(Ninja::Constants::RPC_HOST, Ninja::Constants::RPC_PORT)
      mp_client.call(:cheetah_admin, :logout, login)
      session[:current_user] = nil
      result = { :success => true, :msg => '您已成功退出系统' }
    rescue StandardError => e
      result = { :success => false, :msg => e.message }
    end
    respond_to do |format|
      format.json { render :json => result }
    end
  end
end