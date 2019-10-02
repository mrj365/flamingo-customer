import { Component, OnInit, Input } from '@angular/core';
import { totalmem } from 'os';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  @Input('subtotal')
  subtotal: string;

  @Input('bookingFee')
  bookingFee: string;

  @Input('tax')
  tax: string;

  @Input('giftCardAmountApplied')
  giftCardAmountApplied: string;

  @Input('total')
  total: string;

  @Input('showPaymentMethodMissingWarning')
  showPaymentMethodMissingWarning: boolean;

  @Input('showEstimatedCost')
  showEstimatedCost: boolean;

  @Input('appointmentDate')
  appointmentDate: string;

  @Input('buttonText')
  buttonText: string;

  @Input('buttonAction')
  buttonAction: () => any;

  @Input('processing')
  processing: boolean;

  @Input('affix')
  affix: boolean;

  @Input('refunded')
  refunded: boolean;

  @Input('cumulativeTotalRefundAmount')
  cumulativeTotalRefundAmount: string;

  @Input('cumulativeConvenienceFeeRefundAmount')
  cumulativeConvenienceFeeRefundAmount: string;

  @Input('cumulativeSubtotalotalRefundAmount')
  cumulativeSubtotalotalRefundAmount: string;

  @Input('cancellationFee')
  cancellationFee: string;

  @Input('estimatedTotal')
  estimatedTotal: boolean;

  @Input('cumulativeGiftCardAmountAppliedRefundAmount')
  cumulativeGiftCardAmountAppliedRefundAmount: string;

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.buttonAction();
  }

}
