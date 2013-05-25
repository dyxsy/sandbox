class CaptchaController < ApplicationController
  # get /captcha
  # get /acptcha.json                                               AJAX
  # ---------------------------------------------------------------------
  def simple_captcha
    captcha = get_simple_captcha
    respond_to do |format|
      format.json { render :json => { :success => true,:captcha => captcha} }
    end
  end

  private
  # ---------------------------------------------------------------------
  # get image url
  def get_simple_captcha(options={})
    key = simple_captcha_key(options[:object])
    options[:field_value] = set_simple_captcha_data(key, options)
    url = simple_captcha_image(key, options)
  end
  
  # ---------------------------------------------------------------------
  #  generate image url
  def simple_captcha_image(simple_captcha_key, options = {})
    defaults = {}
    defaults[:time] = options[:time] || Time.now.to_i
    
    query = defaults.collect{ |key, value| "#{key}=#{value}" }.join('&')
    url = "/simple_captcha?code=#{simple_captcha_key}&#{query}"
  end

  # ---------------------------------------------------------------------
  #  get image data
  def set_simple_captcha_data(key, options={})
    code_type = options[:code_type]

    value = generate_simple_captcha_data(code_type)
    data = SimpleCaptcha::SimpleCaptchaData.get_data(key)
    data.value = value
    data.save
    key
  end

  # ---------------------------------------------------------------------
  #  generate image date
  def generate_simple_captcha_data(code)
    value = ''
    
    case code
      when 'numeric' then 
        SimpleCaptcha.length.times{value << (48 + rand(10)).chr}
      else
        SimpleCaptcha.length.times{value << (65 + rand(26)).chr}
    end
    
    return value
  end

  # ---------------------------------------------------------------------
  def simple_captcha_key(key_name = nil)
    if key_name.nil?
      session[:captcha] ||= SimpleCaptcha::Utils.generate_key(session[:id].to_s, 'captcha')
    else
      SimpleCaptcha::Utils.generate_key(session[:id].to_s, key_name)
    end
  end
end
