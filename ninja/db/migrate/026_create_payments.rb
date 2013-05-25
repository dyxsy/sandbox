class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.string          :customer                                      # 雷凯帐号
      t.string          :sign                                          # MD5
      t.string          :order_num                                     # 订单编号
      t.integer         :bank_bill_num                                 #
      t.integer         :transaction_num                               #
      t.decimal         :total,     :precision => 16, :scale => 6      # 交易总额
      t.integer         :status,    :default => 0                      # 1: 支付成功， 0:(默认)处理中, -1:失败
      t.string          :goods                                         # 商品
      t.string          :comment                                       # 备注
      t.string          :ip_address                                    # 顾客IP
      t.timestamps
    end

    add_index :payments, :customer
    add_index :payments, :order_num
    add_index :payments, :created_at
  end
end