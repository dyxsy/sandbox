# encoding: utf-8
class ApplicationController < ActionController::Base
  #protect_from_forgery
  before_filter :params_filter
  def params_filter
    if RUBY_VERSION >= '1.9'
      self.utf8nize(params)
    end
  end

  def utf8nize(obj)
    if obj.is_a? String
      if obj.respond_to?(:force_encoding)
        obj.force_encoding("UTF-8")
      else
        obj
      end
    elsif obj.is_a? Hash
      obj.each {|key, val|
              obj[key] = self.utf8nize(val)
          }
    elsif obj.is_a? Array
      obj.map {|val| self.utf8nize(val)}
    else
      obj
    end
  end

  #----------------------------------------------------------------------------
  def current_user_session
    @current_user_session ||= session[:current_user]
  end
  
  #----------------------------------------------------------------------------
  def current_user
    @current_user ||= current_user_session 
  end

  #----------------------------------------------------------------------------
  # def current_user_session
  #   @current_user_session ||= Authentication.find
  # end
  
  #----------------------------------------------------------------------------
  # def current_user
  #   @current_user ||= (current_user_session && current_user_session.record) 
  # end

  #----------------------------------------------------------------------------
  def require_user
    unless current_user
      result = {
        :success => false,
        :msg     => '请先登录帐号'
      }
      respond_to do |format|
        format.json { render :json => result }
      end
    end   
  end

  #----------------------------------------------------------------------------
  def require_no_user
=begin    
    if current_user
      store_location
      flash[:notice] = t(:msg_logout_needed)
      redirect_to profile_url
    end
=end    
  end

  def only_current_user_visible
    if current_user
       if params[:investor_id]
         if params[:investor_id].to_i == current_user.id
            return true
         else
          respond_to do |format|
            format.json { render :json => {:success => false, :msg => "无此页面访问权限"} }
          end           
         end
       else
         return true
       end
    else # the filter should after require_user filter
      respond_to do |format|
        format.json { render :json => {:success => false, :msg => "请先登录系统"} }
      end 
    end
  end

  #---------------------------------------------------------------------------
  def do_allowed?(action) 
    power_bit = PowerBit.where("action = ?", action.to_s).first
    if !current_user.nil? && !power_bit.nil?
      power_bit_id = ((10 ** (power_bit.id-1)).to_s).to_i(2)
      if (current_user.role.permission & power_bit_id) <= 0
        return false
      else
        return true  
      end
    end
    return false
  end

  def allowed?(action)
    if do_allowed?(action)
      true
    else
      respond_to do |format|
        format.json { render :json => {:success => false, :msg => "无操作权限"} }
      end
    end
  end


  # Get list of records for a given model class.
  #----------------------------------------------------------------------------
  def get_list_of_records(klass, options = {}, &block)
    items = klass.name.tableize
    self.current_page = options[:page]           if options[:page]
    query             = options[:query]          if options[:query]
    category          = options[:category]       if options[:category]
    pagination        = options[:pagination].nil? ? true : options[:pagination] 
    date              = options[:date]           if options[:date]
    #date_range        = options[:date_range]     if options[:date_range]
    start_date        = options[:start_date]     if options[:start_date]
    end_date          = options[:end_date]       if options[:end_date]
    sort_fields       = options[:sort]           if options[:sort]
    sort_dir          = options[:dir] || "ASC"
    per_page          = options[:per_page]       if options[:per_page]

    #self.current_query = options
    records = {
      :user  => @current_user #,
      # :order => @current_user.pref[:"#{items}_sort_by"] || klass.sort_by
    }

    # Use default processing if no hooks are present. Note that comma-delimited
    # export includes deleted records, and the pagination is enabled only for
    # plain HTTP, Ajax and XML API requests.
    wants = request.format
    filter = session[options[:filter]].to_s.split(',') if options[:filter]
    scope = klass.scoped
    scope = scope.category(category)                   if category.present?
    scope = scope.state(filter)                        if filter.present?
    scope = scope.search(query)                        if query.present?
    scope = scope.at_date(date)                        if date.present?
    #scope = scope.between_dates(date_range)            if date_range.present?
    scope = scope.between_dates(start_date, end_date)  if (start_date.present? && end_date.present?)

    if sort_fields.present?
      words = sort_fields.split(".")
      if words.length > 1
        table = words.shift.tableize # popup first item
        field = words.join(".")
        sort_fields2 = "#{table}.#{field}" 
      else
        sort_fields2 = "#{items}.#{words.first}"
      end
      scope = scope.order_by(sort_fields2, sort_dir)
    end

    scope = yield scope                                if block_given?
    scope = scope.unscoped                             if wants.csv?
    scope = scope.page(current_page).per(per_page)
    scope
  end

  # Proxy current page for any of the controllers by storing it in a session.
  #----------------------------------------------------------------------------
  def current_page=(page)
    @current_page = session["#{controller_name}_current_page".to_sym] = page.to_i
  end

  #----------------------------------------------------------------------------
  def current_page
    page = params[:page] || session["#{controller_name}_current_page".to_sym] || 1
    @current_page = page.to_i
  end

  # Proxy current search query for any of the controllers by storing it in a session.
  #----------------------------------------------------------------------------
  def current_query=(query)
    @current_query = session[:advanced_query] = query
  end

  #----------------------------------------------------------------------------
  def current_query
    @current_query = params[:query] || session[:advanced_query] || ""
  end
  def client
  end

end
