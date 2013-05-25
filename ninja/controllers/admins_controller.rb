# encoding: utf-8
class AdminsController < ApplicationController

	def index
		admins = get_admins(:page			=> params[:page],
												:per_page => params[:limit])

		respond_to do |format|
			format.json { render :json => { :success => true,
																			:total	 => admins.total_count,
																			:records => admins.map { |admin| admin.to_record(:grid)}
																			}
									}
		end
	end

	# PUT /admins
  # PUT /admins.json                                              AJAX and HTML
  #----------------------------------------------------------------------------
  def update
    ok_list = []
    failed_list = []
    admin_ids = params[:id].split(",")
    admin_ids.each do |admin_id|
      begin
        Admin.transaction do 
          admin = Admin.where(:id => admin_id).first
          admin.update_attributes(:role_id => params[:role_id])
          ok_list << admin.id
        end
      rescue Exception => e
        logger.error e.message
        logger.error e.backtrace.join("\n")
        failed_list << admin.id
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

	def search	
		admins = get_admins(:query		=> params[:query],
						  					:page 		=> params[:page],
												:per_page => params[:limit])
		respond_to do |format|
			format.json { render :json => { :success => true,
																			:total 	 => admins.total_count,
																			:records => admins.map { |admin| admin.to_record(:grid)}
																		}
									}
		end
	end

  # 判断当前是否有用户登录
  # admins/check_session.json                                              AJAX
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
  # admins/profile.json                                                    AJAX
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
		def get_admins(options = {})
			get_list_of_records(Admin, options)
		end
	end