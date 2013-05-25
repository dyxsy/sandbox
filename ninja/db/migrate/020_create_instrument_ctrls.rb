class CreateInstrumentCtrls < ActiveRecord::Migration
  def change
    create_table :instrument_ctrls do |t|
      t.integer      :instrument_id              # 合约ID
      t.string       :instrument_code            # 合约编码
      t.integer      :investor_id                # 投资者ID
      t.integer      :forbid                     # 禁止的行为(?OPEN, ?CLOSE, ?OPEN_CLOSE)
      t.timestamps
    end

    add_index        :instrument_ctrls,  :instrument_id
    add_index        :instrument_ctrls,  :investor_id
  end
end
