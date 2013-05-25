# encoding: utf-8
class GroupsController < ApplicationController

  def index
    groups = current_user.groups.page(params[:page]).per(params[:limit])
    #groups = get_groups(:page => params[:page], :per_page => params[:limit])
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => groups.total_count,
                                      :records => groups.map{ |group| group.to_record(:grid) }
                                    }
                  }
    end
  end

  def create
    group = Group.new(params[:group])
    group.admin_id = current_user.id
    if group.save
      respond_to do |format|
        format.json { render :json => {:success => true} }
      end
    end
  end

  def update
    group = Group.where(:id => params[:id]).first
    group.update_attributes(params[:group])
    respond_to do |format|
      format.json { render :json => {:success => true}}
    end
    
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false } }
    end
  end

  def destroy
    group = Group.where(:id => params[:id]).first
    count = Membership.where(:group_id => group.id).count
    if count > 0
      respond_to do |format|
        format.json { render :json => { :success => false, :msg => "该组有成员,不能删除" } }
      end
    else
      group.destroy
      respond_to do |format|
        format.json { render :json => { :success => true} }
      end
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false } }
    end
  end

  def group_members
    group = Group.where(:id => params[:id]).first
    investors = group.investors.page(params[:page]).per(params[:limit])
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => investors.total_count,
                                      :records => investors.map{ |investor| investor.to_record(:members_grid) }
                                    }
                  }
    end
  end

  def join_in
    investor_ids = JSON.parse(params[:investor_ids])
    investor_ids.each do |investor_id|
      Membership.create(:group_id => params[:group_id], :investor_id => investor_id)
    end
    respond_to do |format|
      format.json { render :json => { :success => true } }
    end
  end

  def leave
    if params[:destroy_all] # 删除全部成员
      Membership.where(:group_id => params[:group_id]).destroy_all
    else # 删除选中成员
      investor_ids = JSON.parse(params[:investor_ids])
      Membership.where(:group_id => params[:group_id]).where(:investor_id => investor_ids).destroy_all
    end
    respond_to do |format|
      format.json { render :json => { :success => true } }
    end
  end


  private
  def get_groups(options = {})
    get_list_of_records(Group, options)
  end

end