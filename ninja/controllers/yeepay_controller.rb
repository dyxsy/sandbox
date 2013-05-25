# encoding: utf-8
class YeepayController < ApplicationController
  
  def cheetah_client_pay
    base_url = "https://www.yeepay.com/app-merchant-proxy/node"
    merchants = YAML::load(File.read(Rails.root.to_s + '/config/banks.yml'))
    yeepay = merchants["merchants"]["yeepay"]
    bank_code = yeepay["banks"]
    paid_url  = yeepay["paid_url"]
    auth_id   = yeepay["auth_id"]
    auth_key  = yeepay["auth_key"]
    
    pay_params = {}
    price = params[:price]
    login = params[:login]
    product = locate_product(price.to_d)
    pay_params["p0_Cmd"]   = "Buy"          # 业务类型(固定值Buy)
    pay_params["p1_MerId"] = auth_id        # 商户编号
    pay_params["p2_Order"] = p2_Order = (Time.now.to_f).to_s.gsub("\.","")  # 订单编号
    pay_params["p3_Amt"] = price || 0       # 金额
    pay_params["p4_Cur"] = "CNY"            # 交易币种
    pay_params["p5_Pid"] = params[:pname] if !params[:pname].blank?         # 商品名称
    pay_params["p8_Url"] = paid_url         # 支付成功
    #pay_params["p8_Url"] = "http://127.0.0.1:3000/product/paid" # 支付成功
    #pay_params["p9_SAF"] = "test"           # 送货地址
    pay_params["pa_MP"] = login    # 商户扩展信息(雷凯帐号)
    pay_params["pd_FrpId"] = bank_code[params[:bank]] if !params[:bank].blank?
    #pay_params["pr_NeedResponse"] = "1" # 应答机制(固定值1)
    #key = "69cl522AV6q613Ii4W6u8K6XuW8vM1N6bFgyv769220IuYe9u37N4y7rI4Pl" #(测试)
    key = auth_key
    params = []
    
    data = ""
    pay_params.each do |k, v|
      params << "#{k}=#{v}"
      data << v
    end

    params_str = URI.encode(params.join("&").encode("GBK"))
    md5 = OpenSSL::Digest::Digest.new('md5')
    hmac = OpenSSL::HMAC.hexdigest(md5, key, data)


    payment = Payment.create(:customer => login.upcase, 
                             :ip_address => request.remote_ip,
                             :sign => hmac,
                             :order_num => p2_Order,
                             :status => 0,
                             :total => price.to_d)
    payment.delay.check_status

    pay_url = "#{base_url}?#{params_str}&hmac=#{hmac}"
    @url = "http://www.forca.cc/shop/gateway.html?url=#{pay_url}"
    render :layout => false
    #redirect_to pay_url
    #redirect_to "http://localhost:4000/test/referer"
  end

  def paid
    #  "p1_MerId"=>"10001126856",      # 商户编号
    #  "r0_Cmd"=>"Buy",                # 业务类型 
    #  "r1_Code"=>"1",                 # 支付结果 固定值1(支付成功)
    #  "r2_TrxId"=>"218204635532232F", # 易宝支付交易流水号
    #  "r3_Amt"=>"0.01",               # 支付金额
    #  "r4_Cur"=>"RMB",                # 交易币种
    #  "r5_Pid"=>"LeiKai Trading System Trival Edition", #商品名称
    #  "r6_Order"=>"13639261639201512",# 商户订单号
    #  "r7_Uid"=>"",                   # 易宝支付会员ID
    #  "r8_MP"=>"lk100016",            # 商户扩展信息(雷凯帐号)
    #  "r9_BType"=>"1", # 交易结果返回类型 1:浏览器重定向 2.服务器点对点通讯
    #  "ru_Trxtime"=>"20130322122348", # 交易结果通知时间
    #  "ro_BankOrderId"=>"2098357448130322", # 银行订单号
    #  "rb_BankId"=>"CCB-NET",         # 支付通道编码
    #  "rp_PayDate"=>"20130322122339", # 支付成功时间
    #  "rq_CardNo"=>"",                # 神州充值卡序列号
    #  "rq_SourceFee"=>"0.0", 
    #  "rq_TargetFee"=>"0.0", 
    #  "hmac"=>"a357c844b270fd7bc59b558a2badb228" # 签名数据
    # puts "#{params.inspect}"

    @r1_Code = params[:r1_Code]
    if @r1_Code == "1"
      @r3_Amt = params[:r3_Amt]
      @r6_Order = params[:r6_Order]
    end
    
  end

  def pay
    base_url = "https://www.yeepay.com/app-merchant-proxy/node"
    merchants = YAML::load(File.read(Rails.root.to_s + '/config/banks.yml'))
    yeepay = merchants["merchants"]["yeepay"]
    paid_url  = yeepay["paid_url"]
    auth_id   = yeepay["auth_id"]
    auth_key  = yeepay["auth_key"]

    pay_params = {}
    total_price = params[:price].to_d*params[:number].to_i
    pay_params["p0_Cmd"] = "Buy"            # 业务类型(固定值Buy)
    pay_params["p1_MerId"] = auth_id  # 商户编号
    pay_params["p2_Order"] = p2_Order = (Time.now.to_f).to_s.gsub("\.","")  # 订单编号
    pay_params["p3_Amt"] = total_price.to_s || 0 # 金额
    pay_params["p4_Cur"] = "CNY"                 # 交易币种
    #pay_params["p5_Pid"] = product              # 商品名称
    pay_params["p8_Url"] = paid_url              # 支付成功
    #pay_params["p8_Url"] = "http://127.0.0.1:3000/product/paid" # 支付成功
    pay_params["pa_MP"] = current_investor[:login] # 商户扩展信息(雷凯帐号)
    key = auth_key
    params = []
    
    data = ""
    pay_params.each do |k, v|
      params << "#{k}=#{v}"
      data << v
    end

    params_str = URI.encode(params.join("&").encode("GBK"))
    md5 = OpenSSL::Digest::Digest.new('md5')
    hmac = OpenSSL::HMAC.hexdigest(md5, key, data)

    url = "#{base_url}?#{params_str}&hmac=#{hmac}"

    payment = Payment.create(:customer => current_investor[:login].upcase, 
                             :ip_address => request.remote_ip,
                             :sign => hmac,
                             :order_num => p2_Order,
                             :status => 0,
                             :total => total_price)
    payment.delay.check_status
    
    redirect_to url
  end

  def locate_product(price)
    if (price > 0 && price <= 1)
      "雷凯交易期货系统（测试支付）"
    elsif price > 1 && price <= 10000
      "雷凯期货交易系统（含光盘、说明书、售后服务卡）"
    elsif price > 10000 && price <= 50000
      "雷凯期货柜员系统（含光盘、说明书、售后服务卡）"
    else
      "雷凯期货风险监控系统（含光盘、说明书、售后服务卡）"
    end
  end

end