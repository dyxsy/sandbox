class PivotController < ApplicationController
  def index
    render :layout => false
  end
  
  def pay
    @login = params[:login]
    @price = params[:price]
    @bank  = params[:bank]  if !params[:bank].blank?
    @pname = params[:pname] if !params[:pname].blank?
    @token = params[:token]
    render :layout => false
    #@redirect_to  = "http://www.forca.cc:8000/product/pay?login=#{@login}&token=#{@token}&price=#{@price}&bank=#{@bank}"
  end

  def pay3
    @login = params[:login]
    @price = params[:price]
    @bank  = params[:bank]  if !params[:bank].blank?
    @pname = params[:pname] if !params[:pname].blank?
    @token = params[:token]
    render :layout => false
  end

end
