class CreateMarginRates < ActiveRecord::Migration
  def change
    create_table :margin_rates do |t|  # 用户保证金率
      t.integer   :investor_id         # 投资者Id
      t.boolean   :auto_merged         # 自动和期货公司保持一致
      t.timestamps
    end
    add_index :margin_rates, :investor_id
  end
end
