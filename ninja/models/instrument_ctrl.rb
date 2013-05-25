class InstrumentCtrl < ActiveRecord::Base
  # attr_accessible :title, :body
  include Sencha::Model


   belongs_to :investor
   belongs_to :instrument
  
end
