class CreateMarginRateItems < ActiveRecord::Migration
  def change
    create_table :margin_rate_items do |t|    # 保证金率项
      t.integer        :margin_rate_id        # 用户保证金Id
      t.integer        :instrument_id         # 合约
      t.string         :instrument_code       # 合约编码
      t.integer        :direction             # 方向
      t.decimal        :value,              :precision => 16, :scale => 6  # 数值
      t.timestamps
    end

    add_index :margin_rate_items, :margin_rate_id
    add_index :margin_rate_items, :instrument_id
    add_index :margin_rate_items, :instrument_code
    add_index :margin_rate_items, :direction
  end
end
