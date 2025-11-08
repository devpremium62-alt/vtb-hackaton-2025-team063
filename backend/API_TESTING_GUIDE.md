# Руководство по тестированию API backend

Документ описывает основные REST-эндпоинты проекта и примеры запросов для Postman.

## Переменные окружения Postman

| Переменная | Значение | Комментарий |
| --- | --- | --- |
| `base_url` | `http://localhost:8000` | Измените при необходимости на домен окружения |
| `auth_token` | `<Token ...>` | Значение заголовка Authorization после логина |
| `consent_id` | `demo-consent-id` | Используется для межбанковских запросов, если требуется |
| `product_consent_id` | `demo-product-consent` | Для межбанковских запросов к продуктам |

## Аутентификация и общие заголовки

Почти все viewset-ы защищены `IsAuthenticated`, поэтому после получения токена необходимо добавлять заголовок `Authorization: Token {{auth_token}}`.

### POST `/api/banking/auth/login/`

Обработчик: [`user_login()`](vtb-hackaton-2025-team063/backend/banks/views.py:20)
Возвращает токен и данные пользователя, создавая запись при необходимости.

**Headers**

| Ключ | Значение |
| --- | --- |
| `Content-Type` | `application/json` |

**Body (raw JSON)**

```json
{
  "phone": "+79991234567",
  "photo": "data:image/png;base64,...",
  "first_name": "Иван",
  "invitation_code": "TEAM123"
}
```

**Пример ответа (200)**

```json
{
  "user": {
    "id": 1,
    "phone": "+79991234567",
    "first_name": "Иван",
    "team_id": "team-001"
  },
  "token": "3c26c5c1b1b74c53a8b3...",
  "message": "Login successful"
}
```

## Обзор API по доменам

### Банковская интеграция

Основные обработчики находятся в [`BankViewSet`](vtb-hackaton-2025-team063/backend/banks/views.py:73), [`UserProfileViewSet`](vtb-hackaton-2025-team063/backend/banks/views.py:105) и [`AccountSharingViewSet`](vtb-hackaton-2025-team063/backend/banks/views.py:120).

| Метод | Путь | Описание | Обработчик | Особенности |
| --- | --- | --- | --- | --- |
| GET | `/api/banking/banks/` | Список активных банков | [`BankViewSet`](vtb-hackaton-2025-team063/backend/banks/views.py:73) | Требует Token |
| POST | `/api/banking/banks/add_custom_bank/` | Регистрация кастомного банка | [`BankViewSet.add_custom_bank()`](vtb-hackaton-2025-team063/backend/banks/views.py:79) | |
| GET | `/api/banking/profiles/` | Профили пользователя | [`UserProfileViewSet`](vtb-hackaton-2025-team063/backend/banks/views.py:105) | |
| GET | `/api/banking/profiles/me/` | Текущий пользователь | [`UserProfileViewSet.me()`](vtb-hackaton-2025-team063/backend/banks/views.py:112) | |
| POST | `/api/banking/account-sharing/` | Создать запрос на шаринг счетов | [`AccountSharingViewSet.create()`](vtb-hackaton-2025-team063/backend/banks/views.py:131) | Требует `receiver_team_id` |
| POST | `/api/banking/auth/bank/` | OAuth/Client Credentials к банку | [`authenticate_bank()`](vtb-hackaton-2025-team063/backend/banks/views.py:162) | Нужен `bank_name` |

### Счета и транзакции

Реализация в [`AccountViewSet`](vtb-hackaton-2025-team063/backend/accounts/views.py:21) и [`TransactionViewSet`](vtb-hackaton-2025-team063/backend/accounts/views.py:276).

| Метод | Путь | Описание | Обработчик | Особые заголовки |
| --- | --- | --- | --- | --- |
| GET | `/api/accounts/accounts/` | Список счетов пользователя | [`AccountViewSet`](vtb-hackaton-2025-team063/backend/accounts/views.py:21) | `X-Consent-Id`, `X-Requesting-Bank` для межбанка |
| POST | `/api/accounts/accounts/create_account/` | Создание счета | [`AccountViewSet.create_account()`](vtb-hackaton-2025-team063/backend/accounts/views.py:39) | Требует `account_type`, `initial_balance` |
| POST | `/api/accounts/accounts/sync/` | Синхронизация счетов | [`AccountViewSet.sync()`](vtb-hackaton-2025-team063/backend/accounts/views.py:109) | Optional: `bank_name`, `X-Consent-Id` |
| GET | `/api/accounts/accounts/{id}/balances/` | Балансы счета | [`AccountViewSet.balances()`](vtb-hackaton-2025-team063/backend/accounts/views.py:164) | Межбанк: `X-Consent-Id`, `X-Requesting-Bank` |
| PUT | `/api/accounts/accounts/{id}/status/` | Изменение статуса | [`AccountViewSet.status()`](vtb-hackaton-2025-team063/backend/accounts/views.py:179) | |
| PUT | `/api/accounts/accounts/{id}/close/` | Закрытие счета | [`AccountViewSet.close()`](vtb-hackaton-2025-team063/backend/accounts/views.py:67) | Параметр `destination_account_id` при переводе |
| GET | `/api/accounts/accounts/{id}/transactions/` | Транзакции счета | [`AccountViewSet.transactions()`](vtb-hackaton-2025-team063/backend/accounts/views.py:209) | Query: `page`, `limit`, `from_date`, `to_date` |
| GET | `/api/accounts/transactions/` | Все транзакции | [`TransactionViewSet`](vtb-hackaton-2025-team063/backend/accounts/views.py:276) | |
| GET | `/api/accounts/transactions/analytics/` | Аналитика расходов | [`TransactionViewSet.analytics()`](vtb-hackaton-2025-team063/backend/accounts/views.py:288) | Query `days` |

### Платежи и согласия

Основные обработчики: [`PaymentViewSet`](vtb-hackaton-2025-team063/backend/payments/views.py:20), [`PaymentConsentViewSet`](vtb-hackaton-2025-team063/backend/payments/views.py:60), [`PaymentLimitViewSet`](vtb-hackaton-2025-team063/backend/payments/views.py:111).

| Метод | Путь | Описание | Обработчик | Особые заголовки |
| --- | --- | --- | --- | --- |
| GET | `/api/payments/` | Список платежей | [`PaymentViewSet`](vtb-hackaton-2025-team063/backend/payments/views.py:20) | |
| POST | `/api/payments/` | Создание платежа | [`PaymentViewSet.create()`](vtb-hackaton-2025-team063/backend/payments/views.py:30) | Можно указать `consent_id` или `payment_consent_id` |
| GET | `/api/payments/{id}/` | Детали платежа | [`PaymentViewSet`](vtb-hackaton-2025-team063/backend/payments/views.py:20) | |
| GET | `/api/payments/{id}/status/` | Проверка статуса | [`PaymentViewSet.status()`](vtb-hackaton-2025-team063/backend/payments/views.py:45) | |
| GET | `/api/consents/` | Платежные согласия | [`PaymentConsentViewSet`](vtb-hackaton-2025-team063/backend/payments/views.py:60) | |
| POST | `/api/consents/` | Создать согласие | [`PaymentConsentViewSet.create()`](vtb-hackaton-2025-team063/backend/payments/views.py:70) | Требует `bank_name`, `consent_type`, `debtor_account` |
| GET | `/api/consents/{id}/details/` | Детали согласия | [`PaymentConsentViewSet.details()`](vtb-hackaton-2025-team063/backend/payments/views.py:85) | |
| POST | `/api/consents/{id}/revoke/` | Отозвать согласие | [`PaymentConsentViewSet.revoke()`](vtb-hackaton-2025-team063/backend/payments/views.py:96) | |
| GET | `/api/limits/` | Платежные лимиты | [`PaymentLimitViewSet`](vtb-hackaton-2025-team063/backend/payments/views.py:111) | |
| POST | `/api/limits/{id}/reset/` | Сброс лимитов | [`PaymentLimitViewSet.reset()`](vtb-hackaton-2025-team063/backend/payments/views.py:119) | |

### Продукты и договоры

Реализация находится в [`ProductViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:35), [`ProductAgreementViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:88), [`ProductApplicationViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:217) и [`ProductAgreementConsentViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:243).

| Метод | Путь | Описание | Обработчик | Особые требования |
| --- | --- | --- | --- | --- |
| GET | `/api/products/products/` | Каталог активных продуктов | [`ProductViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:35) | Фильтры: `product_type`, `bank_name`, `featured` |
| GET | `/api/products/products/categories/` | Категории продуктов | [`ProductViewSet.categories()`](vtb-hackaton-2025-team063/backend/products/views.py:52) | |
| GET | `/api/products/products/recommendations/` | Персональные предложения | [`ProductViewSet.recommendations()`](vtb-hackaton-2025-team063/backend/products/views.py:58) | |
| POST | `/api/products/products/{id}/apply/` | Подать заявку | [`ProductViewSet.apply()`](vtb-hackaton-2025-team063/backend/products/views.py:69) | Тело как в [`ProductApplicationCreateSerializer`](vtb-hackaton-2025-team063/backend/products/serializers.py:171) |
| GET | `/api/products/agreements/` | Договоры клиента | [`ProductAgreementViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:88) | Межбанк: `X-Product-Agreement-Consent-Id`, `X-Requesting-Bank`, `client_id` |
| POST | `/api/products/agreements/` | Открыть договор | [`ProductAgreementViewSet.create()`](vtb-hackaton-2025-team063/backend/products/views.py:129) | Требует [`ProductAgreementRequestSerializer`](vtb-hackaton-2025-team063/backend/products/serializers.py:242) |
| POST | `/api/products/agreements/{id}/close/` | Закрыть договор | [`ProductAgreementViewSet.close()`](vtb-hackaton-2025-team063/backend/products/views.py:180) | Межбанк требует согласие с правом `close` |
| GET | `/api/products/applications/` | Заявки пользователя | [`ProductApplicationViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:217) | |
| POST | `/api/products/applications/{id}/submit/` | Отправить заявку | [`ProductApplicationViewSet.submit()`](vtb-hackaton-2025-team063/backend/products/views.py:227) | Статус `DRAFT` |
| GET | `/api/products/product-agreement-consents/` | Согласия на продукты | [`ProductAgreementConsentViewSet`](vtb-hackaton-2025-team063/backend/products/views.py:243) | |
| POST | `/api/products/product-agreement-consents/request` | Запросить согласие | [`ProductAgreementConsentViewSet.create()`](vtb-hackaton-2025-team063/backend/products/views.py:251) | |
| POST | `/api/products/product-agreement-consents/{id}/approve/` | Одобрить согласие | [`ProductAgreementConsentViewSet.approve()`](vtb-hackaton-2025-team063/backend/products/views.py:271) | |
| POST | `/api/products/product-agreement-consents/{id}/reject/` | Отклонить согласие | [`ProductAgreementConsentViewSet.reject()`](vtb-hackaton-2025-team063/backend/products/views.py:283) | |

## Примеры запросов для Postman

Ниже приведен набор типичных сценариев. Во всех примерах предполагается, что используется окружение с переменными `{{base_url}}` и `{{auth_token}}`.

1. **Авторизация пользователя**
   - Метод: POST
   - URL: `{{base_url}}/api/banking/auth/login/`
   - Headers: `Content-Type: application/json`
   - Body: см. раздел выше.
   - Ожидаемый код: `200 OK`. Сохраните `token` в `auth_token`.

2. **Получение текущего профиля**
   - Метод: GET
   - URL: `{{base_url}}/api/banking/profiles/me/`
   - Headers: `Authorization: Token {{auth_token}}`
   - Ожидаемый код: `200 OK`, тело содержит данные пользователя.

3. **Синхронизация счетов с конкретным банком**
   - Метод: POST
   - URL: `{{base_url}}/api/accounts/accounts/sync/`
   - Headers:
     - `Authorization: Token {{auth_token}}`
     - при межбанковском вызове: `X-Consent-Id: {{consent_id}}`, `X-Requesting-Bank: VBANK`
   - Body:
```json
{
  "bank_name": "VBANK"
}
```
   - Ответ `200 OK` с количеством синхронизированных счетов.

4. **Создание нового счета**
   - Метод: POST
   - URL: `{{base_url}}/api/accounts/accounts/create_account/`
   - Headers: `Authorization: Token {{auth_token}}`, `Content-Type: application/json`
   - Body:
```json
{
  "account_type": "checking",
  "initial_balance": "15000.00",
  "nickname": "Карманные расходы"
}
```
   - Успешный ответ `201 Created` содержит объект счета.

5. **Получение транзакций счета**
   - Метод: GET
   - URL: `{{base_url}}/api/accounts/accounts/{{account_id}}/transactions/?page=1&limit=20`
   - Headers: `Authorization: Token {{auth_token}}` (+ межбанк при необходимости)
   - Ответ: массив транзакций, сериализованных [`TransactionSerializer`](vtb-hackaton-2025-team063/backend/accounts/serializers.py:52).

6. **Создание платежного согласия (MULTI_USE)**
   - Метод: POST
   - URL: `{{base_url}}/api/consents/`
   - Headers: `Authorization: Token {{auth_token}}`, `Content-Type: application/json`
   - Body:
```json
{
  "bank_name": "VBANK",
  "consent_type": "MULTI_USE",
  "debtor_account": "40817810099910004312",
  "currency": "RUB",
  "max_amount_per_payment": "50000.00",
  "max_total_amount": "200000.00",
  "max_uses": 10
}
```
   - Ответ `201 Created` содержит поля [`PaymentConsentSerializer`](vtb-hackaton-2025-team063/backend/payments/serializer.py:80).

7. **Создание платежа на основании согласия**
   - Метод: POST
   - URL: `{{base_url}}/api/payments/`
   - Headers: `Authorization: Token {{auth_token}}`, `Content-Type: application/json`
   - Body:
```json
{
  "bank_name": "VBANK",
  "amount": "1500.00",
  "currency": "RUB",
  "debtor_account": "40817810099910004312",
  "creditor_account": "40817810440123456789",
  "creditor_name": "ООО \"Поставщик\"",
  "description": "Оплата счета №123",
  "payment_consent_id": "{{last_consent_id}}"
}
```
   - Успешный ответ: `201 Created` с объектом [`PaymentSerializer`](vtb-hackaton-2025-team063/backend/payments/serializer.py:5).

8. **Проверка статуса платежа**
   - Метод: GET
   - URL: `{{base_url}}/api/payments/{{payment_id}}/status/`
   - Headers: `Authorization: Token {{auth_token}}`
   - Ответ: актуальное состояние платежа.

9. **Сброс лимитов платежей**
   - Метод: POST
   - URL: `{{base_url}}/api/limits/{{limit_id}}/reset/`
   - Headers: `Authorization: Token {{auth_token}}`
   - Ответ: обновленные значения [`PaymentLimitSerializer`](vtb-hackaton-2025-team063/backend/payments/serializer.py:225).

10. **Получение продуктовых предложений**
    - Метод: GET
    - URL: `{{base_url}}/api/products/products/recommendations/`
    - Headers: `Authorization: Token {{auth_token}}`
    - Ответ: список [`ProductOfferSerializer`](vtb-hackaton-2025-team063/backend/products/serializers.py:183).

11. **Подача заявки на продукт**
    - Метод: POST
    - URL: `{{base_url}}/api/products/products/{{product_id}}/apply/`
    - Headers: `Authorization: Token {{auth_token}}`, `Content-Type: application/json`
    - Body:
```json
{
  "requested_amount": "300000.00",
  "requested_term": 12,
  "purpose": "Покупка техники"
}
```
    - Ответ `201 Created` с данными [`ProductApplicationSerializer`](vtb-hackaton-2025-team063/backend/products/serializers.py:139).

12. **Создание согласия на доступ к продуктам для стороннего банка**
    - Метод: POST
    - URL: `{{base_url}}/api/products/product-agreement-consents/request`
    - Headers: `Authorization: Token {{auth_token}}`, `Content-Type: application/json`
    - Body:
```json
{
  "requesting_bank": "PARTNERBANK",
  "client_id": "team-001",
  "read_product_agreements": true,
  "open_product_agreements": true,
  "allowed_product_types": ["LOAN", "DEPOSIT"],
  "valid_until": "2025-12-31T23:59:59Z",
  "max_amount": "1000000.00",
  "reason": "Предложение перекредитования"
}
```
    - Ответ `201 Created` с полями [`ProductAgreementConsentSerializer`](vtb-hackaton-2025-team063/backend/products/serializers.py:207).

## Советы по тестированию

- Для межбанковских сценариев убедитесь, что согласия находятся в статусе `AUTHORISED` или `APPROVED`.
- При отправке дат используйте ISO8601 (`YYYY-MM-DDTHH:MM:SSZ`).
- Возможные коды ошибок: `400 Bad Request` (валидация), `403 Forbidden` (нет прав), `404 Not Found` (ресурс отсутствует).
- Для массового тестирования удобно использовать Postman Runner с CSV, задавая переменные `account_id`, `payment_id` и т.д.