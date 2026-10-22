import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { VirtualFrappeContext } from '../src/utils/frappeSimulator.js';

describe('VirtualFrappeContext Simulator Tests', () => {
  test('initializes with default Sales Order document if empty', () => {
    const ctx = new VirtualFrappeContext();
    assert.equal(ctx.doc.doctype, 'Sales Order');
    assert.equal(ctx.doc.name, 'DOC-2026-0001');
    assert.equal(Array.isArray(ctx.logs), true);
    assert.equal(Array.isArray(ctx.alerts), true);
  });

  test('initializes with provided document and tracks child table rows in locals', () => {
    const initialDoc = {
      doctype: 'Quotation',
      name: 'QTN-2026-0099',
      customer: 'Acme Corp',
      items: [
        { item_code: 'ITM-FIBER-01', qty: 5, rate: 45 }
      ]
    };
    const ctx = new VirtualFrappeContext(initialDoc);
    assert.equal(ctx.doc.doctype, 'Quotation');
    assert.equal(ctx.doc.name, 'QTN-2026-0099');
    assert.equal(ctx.doc.customer, 'Acme Corp');

    // Child table registration in locals
    const childDoctype = 'Quotation Item';
    assert.ok(ctx.locals[childDoctype]);
    assert.ok(ctx.locals[childDoctype]['row-1']);
    assert.equal(ctx.locals[childDoctype]['row-1'].item_code, 'ITM-FIBER-01');
  });

  test('registers and retrieves custom buttons', () => {
    const ctx = new VirtualFrappeContext({ doctype: 'Sales Order', name: 'SO-001' });
    const frm = ctx.createVirtualFrm();

    let clicked = false;
    frm.add_custom_button('Approve Discount', () => {
      clicked = true;
    }, 'Actions');

    assert.equal(ctx.buttons.length, 1);
    assert.equal(ctx.buttons[0].label, 'Approve Discount');
    assert.equal(ctx.buttons[0].group, 'Actions');

    // Trigger action
    ctx.buttons[0].action();
    assert.equal(clicked, true);
  });

  test('handles set_df_property to mutate field rules', () => {
    const ctx = new VirtualFrappeContext({ doctype: 'Customer', name: 'CUST-001' });
    const frm = ctx.createVirtualFrm();

    frm.set_df_property('tax_id', 'reqd', 1);
    frm.set_df_property('tax_id', 'hidden', 0);

    assert.equal(ctx.fieldProperties['tax_id']?.reqd, 1);
    assert.equal(ctx.fieldProperties['tax_id']?.hidden, 0);
  });

  test('records logs and alerts via virtual frappe api', () => {
    const ctx = new VirtualFrappeContext();
    const frm = ctx.createVirtualFrm();
    const frappe = ctx.createVirtualFrappe(frm);

    frappe.show_alert('Order Saved Successfully', 5);
    frappe.msgprint('Please review quotation terms');

    assert.equal(ctx.alerts.length, 1);
    assert.equal(ctx.alerts[0].message, 'Order Saved Successfully');
    assert.equal(ctx.messages.length, 1);
    assert.equal(ctx.messages[0].message, 'Please review quotation terms');
  });
});
