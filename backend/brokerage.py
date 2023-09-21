def brokerage_calculator(buy_p, sell_p, quantity, base_brok_per_lot=20):
    # invalid values check
    if buy_p <= 0 or sell_p <= 0 or quantity <= 0 or base_brok_per_lot < 0:
        return None

    # calculate total turnover
    turnover = (buy_p + sell_p) * quantity
    
    # broerage charged buy broker
    brokerage = base_brok_per_lot * 2
    
    # stt charges => only on sell side
    stt = (sell_p * quantity) * (0.05 / 100)
    
    # transaction charges => 0.053% on turnover
    txn_charges = turnover * (0.053 / 100)
    
    # GST on charges => 18%
    gst = (brokerage + txn_charges) * (18 / 100)
    
    # sebi  charges => ₹10 per crore
    sebi_charges = (turnover * 10) / 10000000
    
    # stamp charges => ₹300 per crore
    stamp_duty = (buy_p * quantity * 300) / 10000000

    tot_charges = brokerage + stt + txn_charges + gst + sebi_charges + stamp_duty
    tot_charges = round(tot_charges, 2)
    return tot_charges

# test
x = brokerage_calculator(100, 100, 50)
print("Total charges: {}".format(x))
