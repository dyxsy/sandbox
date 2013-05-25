class Menu < ActiveRecord::Base
  attr_accessible :name, :label, :parent_id

  include Sencha::Model

  #acts_as_tree :order => "label"
  has_and_belongs_to_many :roles

  sencha_fieldset :grid, [:name,:label,:text]

  def self.bundle_menu_items
    parents = self.where(:parent_id => 1)
    result = []
    parents.each do |p|
      menus = self.where(:parent_id => p.id)
      result.push({ :text => p.label,
                    :expanded => true,
                    :id  => p.id,
                    :children => menus.map{|menu| menu.to_record(:grid)}
                  })
    end 
      return result   
  end 

  def text
    text = self.label
  end
end
