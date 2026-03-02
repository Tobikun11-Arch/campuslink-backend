# 🔑 Authentication Flow

## Register

POST `{{baseUrl}}/api/auth/register`

Headers: `Content-Type: multipart/form-data`

Body: form-data
firstName: Juan
lastName: Dela Cruz
email: student@cvsu.edu.ph
password: password123
campus: Indang
role: NORMAL | OFFICER | PRESIDENT
roleProof: (file jpg/png) (required if role is OFFICER or PRESIDENT)

Notes:

- Backend uploads `roleProof` to Appwrite storage and stores `roleProofFileId` + `roleProofUrl` on the user.

Response: `id`, `email`, `verificationCode`

## Verify

POST `{{baseUrl}}/api/auth/verify`

Headers: `Content-Type: application/json`

Body:

```json
{"email": "student@cvsu.edu.ph", "code": "123456"}
```

## Login

POST `{{baseUrl}}/api/auth/login`

Headers: `Content-Type: application/json`

Body:

```json
{"email": "student@cvsu.edu.ph", "password": "password123"}
```

Response: `accessToken` (use this in Authorization header for all next requests)

# 👤 Profiles

## Get My Profile

GET `{{baseUrl}}/api/profiles/me`

Headers: `Authorization: Bearer {{accessToken}}`

## Update My Profile

PATCH `{{baseUrl}}/api/profiles/me`

Headers: `Authorization: Bearer {{accessToken}}`, `Content-Type: application/json`

Body:

```json
{
  "course": "BSCS",
  "yearLevel": "3",
  "bio": "Hello",
  "interests": ["events", "notes"]
}
```

## Follow User

POST `{{baseUrl}}/api/profiles/{{userId}}/follow`

Headers: `Authorization: Bearer {{accessToken}}`

## Unfollow User

DELETE `{{baseUrl}}/api/profiles/{{userId}}/unfollow`

Headers: `Authorization: Bearer {{accessToken}}`

## Followers List

GET `{{baseUrl}}/api/profiles/{{userId}}/followers`

## Following List

GET `{{baseUrl}}/api/profiles/{{userId}}/following`

# 📅 Events

## Create Event

POST `{{baseUrl}}/api/events`

Headers: `Authorization: Bearer {{accessToken}}`, `Content-Type: application/json`

Body:

```json
{
  "title": "Seminar",
  "description": "Tech talk",
  "dateTime": "2026-03-10T09:00:00.000Z",
  "campus": "Indang",
  "type": "academic"
}
```

## List Events

GET `{{baseUrl}}/api/events?campus=Indang&type=academic&dateFrom=2026-02-25&dateTo=2026-02-28`

## RSVP to Event

POST `{{baseUrl}}/api/events/{{eventId}}/rsvp`

Headers: `Authorization: Bearer {{accessToken}}`

## Cancel RSVP

DELETE `{{baseUrl}}/api/events/{{eventId}}/rsvp`

Headers: `Authorization: Bearer {{accessToken}}`

# 🎒 Lost & Found

## Create Lost Item

POST `{{baseUrl}}/api/lostfound`

Headers: `Authorization: Bearer {{accessToken}}`

Body: form-data
photo: (file)
itemTitle: Wallet
description: Black wallet
location: Library

## List Lost Items

GET `{{baseUrl}}/api/lostfound?status=ACTIVE&campus=Indang`

## Get Lost Item Detail

GET `{{baseUrl}}/api/lostfound/{{postId}}`

## Mark Retrieved

PATCH `{{baseUrl}}/api/lostfound/{{postId}}/retrieve`

Body:

```json
{"retrievedBy": "userId"}
```

# 🛒 Marketplace

## Create Marketplace Post

POST `{{baseUrl}}/api/marketplace`

Headers: `Authorization: Bearer {{accessToken}}`

Body: form-data
images: (file)
itemTitle: Calculator
description: Used calculator
price: 500

## List Marketplace Posts

GET `{{baseUrl}}/api/marketplace`

## Report Marketplace Post

POST `{{baseUrl}}/api/marketplace/{{postId}}/report`

Body:

```json
{"reason": "Scam"}
```

# 📚 Notes

## Create Note

POST `{{baseUrl}}/api/notes`

Headers: `Authorization: Bearer {{accessToken}}`

Body: form-data
file: (pdf)
title: Calculus Notes
description: Chapter 1
campus: Indang

## List Notes

GET `{{baseUrl}}/api/notes`

## Approve Note (Moderator/Admin)

PATCH `{{baseUrl}}/api/notes/{{noteId}}/approve`

## Reject Note

PATCH `{{baseUrl}}/api/notes/{{noteId}}/reject`

Body:

```json
{"reason": "Low quality"}
```

## Track Note View

PATCH `{{baseUrl}}/api/notes/{{noteId}}/view`

Headers: `Authorization: Bearer {{accessToken}}`

## Track Note Download

PATCH `{{baseUrl}}/api/notes/{{noteId}}/download`

Headers: `Authorization: Bearer {{accessToken}}`

# 👥 Section Groups

## Create Invite

POST `{{baseUrl}}/api/sections/{{sectionId}}/invite`

## Join Section

POST `{{baseUrl}}/api/sections/{{sectionId}}/join`

Body:

```json
{"token": "{{inviteToken}}"}
```

# 🔔 Notifications

## List Notifications

GET `{{baseUrl}}/api/notifications`

## Send Notification

POST `{{baseUrl}}/api/notifications`

Body:

```json
{
  "type": "EVENT",
  "targetAudience": "CAMPUS",
  "delivery": "PUSH",
  "recipientIds": ["userId"],
  "title": "Event Update",
  "body": "New event posted"
}
```

## Mark Notification as Read

PATCH `{{baseUrl}}/api/notifications/{{notificationId}}/read`

Headers: `Authorization: Bearer {{accessToken}}`

# 🛡️ Admin

## List Pending Roles

GET `{{baseUrl}}/api/admin/pending-roles`

## Approve Role

POST `{{baseUrl}}/api/admin/roles/{{userId}}/approve`

## Reject Role

POST `{{baseUrl}}/api/admin/roles/{{userId}}/reject`

## List Reports

GET `{{baseUrl}}/api/admin/reports`

## Resolve Report

POST `{{baseUrl}}/api/admin/reports/{{reportId}}/resolve`

# 📂 Files

## Upload File

POST `{{baseUrl}}/api/files/upload`

Headers: `Authorization: Bearer {{accessToken}}`

Body: form-data
file: (jpg/png/pdf)

# ✅ Flow Order

Auth → Profiles → Events → Lost & Found → Marketplace → Notes → Sections → Notifications → Admin → Files.
This mirrors the lifecycle: create first, then list/retrieve, then update/moderate, then admin actions, finally file uploads.
