# encoding: utf-8
class RolesController < ApplicationController
  before_filter(:only => [:create]) {|c| allowed?(:create_role)}
  before_filter(:only => [:update]) {|c| allowed?(:update_role)}
  before_filter(:only => [:destroy]) {|c| allowed?(:destory_role)}
  before_filter(:only => [:add_permissions]) {|c| allowed?(:permission_config)}
  before_filter(:only => [:add_menus]) {|c| allowed?(:menu_config)}

  def index
    roles = get_roles(:page => params[:page], :per_page => params[:limit])
    respond_to do |format|
      format.json{ render :json => { :success => true,
                                    # :total => roles.total_count,
                                     :records => roles.map{|role| role.to_record}
                                   }
                 }
    end
  end
  
  
  # POST /roles
  # POST /roles.json                                              AJAX and HTML
  #----------------------------------------------------------------------------
  def create
    role = Role.new(params[:role])
    if role.save
      respond_to do |format|
        format.json { render :json => {:success => true} }
      end
    end
  end
  
  # PUT /roles/id
  # PUT /roles/id.json                                            AJAX and HTML
  #----------------------------------------------------------------------------
  def update
    role = Role.where(:id => params[:id]).first
    role.update_attributes(params[:role])
    respond_to do |format|
      format.json { render :json => {:success => true}}
    end
    
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false }}
    end
  end
  
  
  # DELETE /roles/id
  # DELETE /roles/id.json                                        AJAX and HTML
  #----------------------------------------------------------------------------
  def destroy
    role = Role.where(:id => params[:id]).first
    if role.built_in
      msg = "系统内置角色不能被删除"
      result = false
    else
      role.destroy
      result = true  
    end
     
    respond_to do |format|
      format.json {render :json => { :success => result, :msg => msg } }
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false } }
    end
  end
  
  # GET /roles/show_roles
  # GET /roles/show_roles.json                                    AJAX and HTML
  #----------------------------------------------------------------------------
  def show_roles
    roles = Role.all
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :records => roles.map{ |role| role.to_record(:grid) }
                                    }
                  }
    end
  end
  
  # GET /roles/show_permissions
  # GET /roles/show_permissions.json                              AJAX and HTML
  #----------------------------------------------------------------------------
  def show_permissions
    role = Role.where(:id => params[:role_id]).first
    power_bits = PowerBit.by_groups
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :permissions => role.permission,
                                      :data => power_bits
                                    }
                   }
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false, :msg => "找不到记录"} }
    end 
  end
  
  # POST /roles/add_permissions
  # POST /roles/add_permissions.json                              AJAX and HTML
  #----------------------------------------------------------------------------
  def add_permissions
    if params[:permissions].present?
      role = Role.where(:id => params[:role_id]).first
      role.update_attributes(:permission => params[:permissions])
      role.save
    end
    #current_user.log(Ninja::Constants::LOG_PERMISSIONS,"修改#{role.label}操作权限")
    respond_to do |format|
      format.json { render :json => {:success => true}}
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false, :msg => "找不到记录"} }
    end 
  end

  def show_menus
    role = Role.where(:id => params[:role_id]).first
    menus_text = []
    menus = Menu.bundle_menu_items
    role.menus.each do |menu|
      menus_text << menu.label
    end
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :menus_text => menus_text,
                                      :data =>{:text => "菜单配置",:expanded => true,:children => menus}
                                    }
                   }
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false, :msg => "找不到记录"} }
    end 
  end

  def add_menus
    role = Role.where(:id => params[:role_id]).first
    menus_id  = JSON.parse(params[:menus_id])
    Role.transaction do
      role.menus = []
      menus_id.each do |menu_id|
        role.menus << Menu.where(:id => menu_id).first
      end
      role.save
      #current_user.log(Finance::Constants::LOG_CFG_MENUS,"修改#{role.label}菜单")
    end
    respond_to do |format|
      format.json { render :json => {:success => true}}
    end

  rescue Exception => ex
    respond_to do |format|
      format.json { render :json => { :success => false, :msg => "事务不一致"} }
    end

  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false, :msg => "找不到记录"} }
    end 
  end

  def validate
    result = false
    result = true  if current_user && (current_user.is_a? User)
    respond_to do |format|
      format.json{ render :json => { :success => true, :result => result}}
    end
  end
  
  private
  #----------------------------------------------------------------------------
  def get_roles(options = {})
    get_list_of_records(Role, options)
  end
end
