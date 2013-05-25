class CreateCommissionRateItems < ActiveRecord::Migration
  def change
    create_table :commission_rate_items do |t|
      t.integer        :commission_rate_id    # 用户手续费Id
      t.integer        :instrument_id         # 合约
      t.string         :instrument_code       # 合约编码
      t.string         :offset                # 开/平
      t.integer        :direction             # 方向
      t.integer        :category              # 手续费类型(固定手续费=1, 百分比手续费=0)
      t.decimal        :fixed,              :precision => 16, :scale => 6  # 数值
      t.decimal        :perc,               :precision => 16, :scale => 6  # 百分比
      t.timestamps
    end

    add_index :commission_rate_items, :commission_rate_id
    add_index :commission_rate_items, :instrument_id
    add_index :commission_rate_items, :instrument_code
    add_index :commission_rate_items, :offset
    add_index :commission_rate_items, :direction
  end
end
