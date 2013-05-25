# encoding: utf-8
class UsersController < ApplicationController

  # PUT /users
  # PUT /users.json                                               AJAX and HTML
  #----------------------------------------------------------------------------
  def update
    ok_list = []
    failed_list = []
    user_ids = params[:id].split(",")
    user_ids.each do |user_id|
      begin
        User.transaction do 
          user = User.where(:id => user_id).first
          user.update_attributes(:role_id => params[:role_id])
          ok_list << user.id
        end
      rescue Exception => e
        logger.error e.message
        logger.error e.backtrace.join("\n")
        failed_list << user.id
      end
    end
    respond_to do |format|
      format.json{ render :json => { :success => true, 
                                     :records => {:ok_list => ok_list, 
                                                  :failed_list => failed_list} 
                                   }
                 }
    end
  end

  # 判断当前是否有用户登录
  # users/check_session.json                                           AJAX
  #----------------------------------------------------------------------------
  def check_session
    if current_user
      json_data = {:success => true,
                   :id      => current_user.id,
                   :login   => current_user.login}
    else 
      json_data = {:success => false}
    end  
    respond_to do |format|
      format.json { render :json => json_data}
    end
  end

  # 用户登录信息
  # users/profile.json                                                     AJAX
  #----------------------------------------------------------------------------
  def profile
    if current_user
      data = current_user.to_record(:profile)
    end
    respond_to do |format|
      format.json { render :json => {:success => true, :data => data}}
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false, :msg => "找不到当前记录"} }
    end 
  end

  private
  #----------------------------------------------------------------------------
  def get_users(options = {})
    get_list_of_records(User, options)
  end

end