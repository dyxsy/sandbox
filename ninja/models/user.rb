# encoding: utf-8
class User < ActiveRecord::Base
  include Sencha::Model
  attr_accessible :login, :password, :role_id, :name
  belongs_to :role
  sencha_fieldset :profile, [:login, :user_role]

  simple_column_search :login, :name,  :match  => :middle

  acts_as_authentic do |c|
    c.validate_email_field          = false
    c.require_password_confirmation = false
  end

  def user_role
    return self.role.name  if self.role
  end

end
