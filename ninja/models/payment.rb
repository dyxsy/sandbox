# encoding: utf-8
class Payment < ActiveRecord::Base
  include Sencha::Model
  attr_accessible :customer, :ip_address, :sign, :order_num, :total, :comment, :status, :goods

  sencha_fieldset :grid, [:customer, :ip_address, :sign, :order_num, :total, 
                          :comment, :status, :goods, :created_at, :success_time]

  simple_column_search :customer,   :match  => :middle 
  #根据支付成功时间范围
  scope :finace_with_date,              lambda{ |started_at, ended_at| where("updated_at >=? and updated_at <= ?",
                                                                started_at, ended_at)}
  #根据支付成功时间、金额范围
  scope :finace_with_totalDate,         lambda{ |started_at, ended_at,start_total,end_total|
                                          if end_total=='0'
                                            where("updated_at >=? and updated_at <= ? and total >=?",
                                            started_at, ended_at,start_total)
                                          else
                                            where("updated_at >=? and updated_at <= ? and total >=? and total <= ?",
                                            started_at, ended_at,start_total,end_total)
                                          end
                                        }
  #根据支付状态，按支付成功时间范围
  scope :finace_with_dateStatus,        lambda{ |started_at, ended_at,status| where("updated_at >=? and updated_at <= ? and status = ?",
                                                                started_at, ended_at,status)} 
  #根据支付状态，按支付成功时间范围、金额范围查询
  scope :finace_with_totalDateStatus,   lambda{ |started_at, ended_at,status,start_total,end_total|
                                          if end_total=='0'
                                            where("updated_at >=? and updated_at <= ? and total >=? and status = ?",
                                            started_at, ended_at,start_total,status)
                                          else
                                            where("updated_at >=? and updated_at <= ? and total >=? and total <= ?  and status = ?",
                                            started_at, ended_at,start_total,end_total,status)
                                          end
                                        }
  # 支付查询
  # ============================================
  def check_status
    merchants = YAML::load(File.read(Rails.root.to_s + '/config/banks.yml'))
    yeepay = merchants["merchants"]["yeepay"]
    auth_id   = yeepay["auth_id"]
    auth_key  = yeepay["auth_key"]
    base_url = "http://www.yeepay.com/app-merchant-proxy/command"
    pay_params = {}
    pay_params["p0_Cmd"] = "QueryOrdDetail"
    pay_params["p1_MerId"] = auth_id
    pay_params["p2_Order"] = order_num
    params = []
    data = ""
    pay_params.each do |k, v|
      params << "#{k}=#{v}"
      data << v
    end
    params_str = params.join("&")

    key = auth_key
    md5 = OpenSSL::Digest::Digest.new('md5')
    hmac = OpenSSL::HMAC.hexdigest(md5, key, data)

    url = "#{base_url}?#{params_str}&hmac=#{hmac}"
    cert_store = OpenSSL::X509::Store.new
    cert_store.add_file Rails.root.to_s + '/cacert.pem'

    agent = Mechanize.new
    agent.user_agent_alias = "Windows IE 9"
    agent.cert_store = cert_store

    Rails.logger.info("Checking payment(id=#{self.id}, order=#{self.order_num}) status using url: #{url}")

    doc = agent.get url
    hash = {}
    response = doc.body.split("\n").collect{|c| c.split("=")}
    response.each do |key, value|
      hash[key] = value
    end

    pay_status = hash["rb_PayStatus"]
    Rails.logger.info("Result payment(id=#{self.id}, order=#{self.order_num}) status: #{pay_status}")
    if pay_status == "SUCCESS"
      update_attributes(:status => 1)
      login = self.customer.upcase
      amount = self.total
      sms_notify(login, amount, self.order_num)
    else
      raise "check_failed"
    end
  end

  handle_asynchronously :check_status, :run_at => Proc.new { 1.minutes.from_now }

  def sms_notify(login, amount, order_num)
    investor = Investor.where(:login => login).first
    groups = investor.groups
    return if groups.empty?
    name = investor ? investor.name : ""
    now = Time.now.strftime("%Y-%m-%d %H:%M:%S")             # 入金时间
    amount_format = ActionController::Base.helpers.number_to_currency(amount, :unit => "", :separator => ".", :delimiter => ",")
    text = "#{login}(#{name})于#{now}成功入金#{amount_format}元,编号: #{order_num}。【雷凯】"
    numbers = groups.collect{|group| group.notification_nums.split(",")}.flatten
    numbers.each do |number|
      outbox = SMS::Outbox.create(:insertdate   => now,
                                  :number       => number,
                                  :text         => text,
                                  :scheduled_at => now,
                                  :handler      => "emay",
                                  :objective    => "cheetah_cap_in")
    end
  end

  def success_time
    self.updated_at == self.created_at ? "" : self.updated_at
  end

end