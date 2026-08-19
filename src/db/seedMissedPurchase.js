import { processHotmartPayload } from '../controllers/hotmartWebhookController.js';

export const missedPurchasePayload = {
  "id": "cb51c449-20c2-40c2-811d-e1fc21335f76",
  "creation_date": 1786194304430,
  "event": "PURCHASE_COMPLETE",
  "version": "2.0.0",
  "data": {
    "product": {
      "id": 8204535,
      "ucode": "b6c0ee97-bab3-4d19-8546-b88161613480",
      "name": "Frete amigo",
      "warranty_date": "2026-08-07T00:00:00Z",
      "has_co_production": false,
      "is_physical_product": false,
      "product_format_id": 8
    },
    "affiliates": [
      {
        "affiliate_code": "",
        "name": ""
      }
    ],
    "buyer": {
      "email": "lucasboni2022@gmail.com",
      "ucode": "e6c7d009-aa20-4ddf-8654-5dbac1ace3fb",
      "name": "LUCAS B ARRUDA",
      "first_name": "LUCAS",
      "last_name": "ARRUDA",
      "checkout_phone_code": "65",
      "checkout_phone": "65992221821",
      "address": {
        "city": "Cuiabá",
        "country": "Brasil",
        "country_iso": "BR",
        "state": "MT",
        "neighborhood": "Bela Vista",
        "zipcode": "78050554",
        "address": "Rua Dezessete",
        "number": "220",
        "complement": ""
      },
      "document": "01821031105",
      "document_type": "CPF"
    },
    "producer": {
      "name": "Lucas Bonifacio de arruda",
      "document": "01821031105",
      "legal_nature": "Pessoa Física"
    },
    "commissions": [
      {
        "value": 6.93,
        "source": "MARKETPLACE",
        "currency_value": "BRL"
      },
      {
        "value": 50.48,
        "source": "PRODUCER",
        "currency_value": "BRL"
      }
    ],
    "purchase": {
      "approved_date": 1785539633000,
      "full_price": {
        "value": 59.9,
        "currency_value": "BRL"
      },
      "price": {
        "value": 59.9,
        "currency_value": "BRL"
      },
      "checkout_country": {
        "name": "Brasil",
        "iso": "BR"
      },
      "order_bump": {
        "is_order_bump": false
      },
      "original_offer_price": {
        "value": 59.9,
        "currency_value": "BRL"
      },
      "order_date": 1785539630000,
      "status": "COMPLETED",
      "transaction": "HP0443067096",
      "payment": {
        "installments_number": 1,
        "type": "CREDIT_CARD"
      },
      "offer": {
        "code": "aupc4z8n"
      },
      "invoice_by": "SELLER",
      "subscription_anticipation_purchase": false,
      "date_next_charge": 1788177600000,
      "recurrence_number": 1,
      "is_funnel": false,
      "business_model": "I"
    },
    "subscription": {
      "status": "ACTIVE",
      "plan": {
        "id": 1358134,
        "name": "Profissional"
      },
      "subscriber": {
        "code": "9MQE13V1"
      }
    }
  }
};

export async function seedMissedPurchase() {
  try {
    const result = await processHotmartPayload(missedPurchasePayload);
    console.log('[SeedMissedPurchase] ✅ Compra pendente registrada com sucesso:', result);
  } catch (error) {
    console.error('[SeedMissedPurchase] ❌ Erro ao registrar compra pendente:', error.message);
  }
}
