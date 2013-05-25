# encoding: utf-8
class InterestedGroupsController < ApplicationController

  # GET /interested_groups
  # GET /interested_groups.json                                              AJAX and HTML
  #----------------------------------------------------------------------------
  def index
    interested_groups = InterestedGroup.all
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :records => interested_groups.map{ |interested_group| interested_group.to_record(:grid) }
                                    }

                  }
    end
  end

  # POST /interested_groups
  # POST /interested_groups.json                                             AJAX and HTML
  #----------------------------------------------------------------------------
  def create
    interested_group = InterestedGroup.new(params[:interested_group])
    if interested_group.save
      respond_to do |format|
        format.json { render :json => {:success => true} }
      end
    end
  end

  # PUT /interested_groups
  # PUT /interested_groups.json                                              AJAX and HTML
  #----------------------------------------------------------------------------
  def update
    interested_group = InterestedGroup.where(:id => params[:id]).first
    interested_group.update_attributes(params[:interested_group])
    if interested_group.save
      respond_to do |format|
        format.json { render :json => {:success => true}}
      end
    end
    
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false } }
    end
  end

  # DELETE /interested_groups
  # DELETE /interested_groups.json                                           AJAX and HTML
  #----------------------------------------------------------------------------
  def destroy
    interested_group = InterestedGroup.where(:id => params[:id]).first
    member_count = interested_group.member_count
    if member_count == 0 || member_count == nil
      interested_group.destroy
      respond_to do |format|
        format.json { render :json => { :success => true } }
      end
    else
      respond_to do |format|
        format.json { render :json => { :success => false, :msg => "该组有成员,不能删除" } }
      end
    end

  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false } }
    end
  end

end