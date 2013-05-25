class CreateFinanceWithBills < ActiveRecord::Migration
  def change
    create_table :finance_with_bills do |t|
      t.integer  :finance_with_id                                          # 配资用户
      t.decimal  :amount,                :precision => 16, :scale => 6     # 金额
      t.string   :comment                                                  # 备注
      t.timestamps
    end
  end
end
