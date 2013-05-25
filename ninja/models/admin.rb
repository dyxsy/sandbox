class Admin < ActiveRecord::Base
	include Sencha::Model
  attr_accessible :role_id
	simple_column_search :login, :name,   :match  => :middle 
	sencha_fieldset :grid, [:name, :login, :out_id, :comment, :user_role ]
  sencha_fieldset :profile, [:login, :user_role]
	belongs_to :role
  has_many :groups

  def user_role
    return self.role.label if self.role
  end

end