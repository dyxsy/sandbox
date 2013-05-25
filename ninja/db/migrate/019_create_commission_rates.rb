class CreateCommissionRates < ActiveRecord::Migration
  def change
    create_table :commission_rates do |t|
      t.integer   :investor_id         # 投资者Id
      t.boolean   :auto_merged         # 自动和期货公司保持一致
      t.timestamps
    end
    add_index :commission_rates, :investor_id
  end
end
