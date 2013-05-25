class CreateWithdrawals < ActiveRecord::Migration
  def change
    create_table :withdrawals do |t|
      t.string  :login                         # 帐号
      t.string  :bank                          # 开户行
      t.string  :bank_account                  # 银行帐号
      t.string  :comment                       # 备注
      t.integer :status                        # 状态(null: 未处理, 0: 未出金, 1:已出金 )
      t.string  :objective                     # 出金原因

      t.timestamps
    end
  end
end