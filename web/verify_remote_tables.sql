SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '867a6b6e-0620-44a9-94b4-21108434889e', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ali@smemail.com","user_id":"19b5809d-5065-406e-911a-afe376bb4845","user_phone":""}}', '2025-05-27 13:49:56.710276+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff220b4e-2ab8-480a-8b60-6c1d51b38f02', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:50:43.168503+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb3e393c-9dcf-48a2-92db-ea2084ceb6e9', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:50:47.501282+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec4dfbb5-629d-4209-8a3a-06a474173d4a', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:50:49.765723+00', ''),
	('00000000-0000-0000-0000-000000000000', '0980bf53-ea36-4ad9-b390-e83a98dd7aaa', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:50:51.533268+00', ''),
	('00000000-0000-0000-0000-000000000000', '30285034-7055-40b9-93d3-2d1407a6f651', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:51:03.129137+00', ''),
	('00000000-0000-0000-0000-000000000000', '966ffa69-2de3-4d77-87ce-45b8f88be1e4', '{"action":"user_confirmation_requested","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-05-27 17:20:10.060989+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f627beb7-db54-4e09-9c00-b60375413978', '{"action":"user_signedup","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-05-27 17:23:08.605944+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6115131-47a5-4f24-94d6-4e0dbf2800b6', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 17:24:02.265325+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bf0f379-0517-481b-990a-3d189d50812e', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 17:24:06.328647+00', ''),
	('00000000-0000-0000-0000-000000000000', '92f4f6a8-790d-472c-938b-23b6d6ece961', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 17:24:13.232001+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d034fb5-2cab-4733-b49c-525496b0190a', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 18:49:47.904763+00', ''),
	('00000000-0000-0000-0000-000000000000', '78aba6fa-0cd1-44ac-8e1c-d36b3c5dc6de', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 18:49:51.675781+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0746f63-e24f-488c-99d6-291c0c974a64', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 18:50:34.320275+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6aa2b2b-ab5e-46db-be0b-4fedbb97151c', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 18:54:55.444704+00', ''),
	('00000000-0000-0000-0000-000000000000', '07da5999-2215-46f1-b7cc-3adb55a2e6e5', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 18:54:57.668769+00', ''),
	('00000000-0000-0000-0000-000000000000', '14106a40-71cd-4cc6-9699-22674283a096', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 18:55:19.497008+00', ''),
	('00000000-0000-0000-0000-000000000000', '659b4b63-a83a-47d4-844e-269beed7c3f1', '{"action":"logout","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-27 19:05:21.849772+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f738ad5-8735-4de6-bb89-704e24c9ffde', '{"action":"login","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 19:05:40.624437+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f7bf15e-3a30-495e-8999-5ac69fd41d6f', '{"action":"token_refreshed","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-27 20:42:14.317392+00', ''),
	('00000000-0000-0000-0000-000000000000', '59d91554-9f1a-477d-9b61-6cbe188da9c0', '{"action":"token_revoked","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-27 20:42:14.319083+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ee318cf-504d-424e-8417-1a4d01d20a98', '{"action":"logout","actor_id":"19b5809d-5065-406e-911a-afe376bb4845","actor_username":"ali@smemail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-27 21:00:57.66974+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e4d1c6a-ade9-4a04-bc82-5c6149df2b53', '{"action":"user_confirmation_requested","actor_id":"4e6c58a5-a9bd-4f73-8f09-e4d1381d2f24","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-05-27 21:06:53.797574+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cdc60852-2906-4fd9-a13b-70a343ec1d12', '{"action":"user_confirmation_requested","actor_id":"4e6c58a5-a9bd-4f73-8f09-e4d1381d2f24","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-05-27 21:07:57.769072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cec033bf-49e8-40d8-a6fd-72fdf44c7625', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ali@smemail.com","user_id":"19b5809d-5065-406e-911a-afe376bb4845","user_phone":""}}', '2025-05-27 21:08:55.443238+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce85a3f7-5dc6-43e9-a68f-6f2e20a958fd', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@yourcompany.com","user_id":"4e6c58a5-a9bd-4f73-8f09-e4d1381d2f24","user_phone":""}}', '2025-05-27 21:09:46.70827+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f7d34bd-b3b4-40b9-aaf0-31a5f63496fc', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@yourcompany.com","user_id":"687db55a-e046-4372-9752-90aede138969","user_phone":""}}', '2025-05-27 21:10:06.859243+00', ''),
	('00000000-0000-0000-0000-000000000000', '135c6f34-54ae-4944-bc10-eafdb4df15d8', '{"action":"login","actor_id":"687db55a-e046-4372-9752-90aede138969","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 21:10:27.467024+00', ''),
	('00000000-0000-0000-0000-000000000000', '52ad5848-5af7-448e-8a63-3ff7b23bdd7d', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@yourcompany.com","user_id":"687db55a-e046-4372-9752-90aede138969","user_phone":""}}', '2025-05-27 21:11:35.073056+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be39cbc1-64e9-45fb-bea9-a9d5a40bdb62', '{"action":"user_signedup","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-05-27 21:12:34.411931+00', ''),
	('00000000-0000-0000-0000-000000000000', '80c83ca7-c70a-4570-9d00-fe60ac09431e', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 21:12:34.415476+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b7115b5b-9199-4431-9d2b-784426ea8d2b', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 21:12:37.841232+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f57a405-b78d-4257-b9e9-74d47068e219', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 21:13:30.535624+00', ''),
	('00000000-0000-0000-0000-000000000000', '68969149-6da8-4563-825f-4f062b3edc55', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 21:13:32.295997+00', ''),
	('00000000-0000-0000-0000-000000000000', '981a8398-5bd3-4c0d-8f89-31c3c399cd61', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 21:13:41.244249+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5403fd1-8e03-4525-87f9-b93caf37fd79', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 21:17:55.890948+00', ''),
	('00000000-0000-0000-0000-000000000000', '92c16721-0a8b-4247-a6ec-9f84c9eee625', '{"action":"token_refreshed","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 04:01:33.479083+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db944832-4ec7-4a27-a8e7-e3f3b637ce37', '{"action":"token_revoked","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 04:01:33.483435+00', ''),
	('00000000-0000-0000-0000-000000000000', '3627fb63-c3a8-4b02-8e94-e19f8efb6c58', '{"action":"token_refreshed","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 11:20:37.950295+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c60e635-4c0b-4cde-91b0-c6496fa99679', '{"action":"token_revoked","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 11:20:37.955128+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc997555-a74e-4aeb-869d-efafba7de9ad', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 11:34:33.067355+00', ''),
	('00000000-0000-0000-0000-000000000000', '9189f364-762e-4fcc-9de6-dbc631f81bac', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 11:34:33.068264+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6bd5585-bfff-4ad2-accd-9bbfe9be545b', '{"action":"token_refreshed","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 12:51:51.476471+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5335b49-dd09-4559-a92c-957d45f2066a', '{"action":"token_revoked","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-28 12:51:51.478858+00', ''),
	('00000000-0000-0000-0000-000000000000', '9889da3b-a57a-43b1-9d1c-7f989ea8886c', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-28 12:52:41.945919+00', ''),
	('00000000-0000-0000-0000-000000000000', '0adeb375-163a-4f97-ad5c-0ec83768e7c4', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-28 12:54:36.686441+00', ''),
	('00000000-0000-0000-0000-000000000000', '46560c9c-351c-408f-aedc-2a42223c8d1b', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-28 12:54:53.117715+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c77792d-dc12-47c5-bc18-eae532ff1e44', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-28 13:02:27.767423+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef1fe5be-3a9b-4ea3-892b-f8e00d070684', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-28 13:14:27.261528+00', ''),
	('00000000-0000-0000-0000-000000000000', '52f738b2-9bb9-4d1b-8e3b-3fd0a0b19154', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-28 13:30:31.849438+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d000d56-0d2f-4881-ac1a-aeb04520ee2e', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"hr@hrportal.com","user_id":"e8e2cf54-1131-4bed-be9c-8990fe584a30","user_phone":""}}', '2025-05-29 03:21:52.766725+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a653ade8-2e3b-4e08-895a-675f3a35d4c8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"manager@hrportal.com","user_id":"0409372c-19fe-4f18-8523-4046d13780f8","user_phone":""}}', '2025-05-29 03:21:54.766543+00', ''),
	('00000000-0000-0000-0000-000000000000', '960a2177-6757-4920-be4d-9d4cd1bf6e07', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"employee@hrportal.com","user_id":"96793cb4-2b42-4867-b9d0-1d7f935769df","user_phone":""}}', '2025-05-29 03:21:56.817879+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c0e9d6b-8ea0-4259-87e1-e6f185cac12c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"recruiter@hrportal.com","user_id":"66e4b50c-aff0-40c8-bdb1-520d6c856451","user_phone":""}}', '2025-05-29 03:21:59.481107+00', ''),
	('00000000-0000-0000-0000-000000000000', '18049264-62d1-4b73-b290-674df40bb6b7', '{"action":"token_refreshed","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 03:40:21.800124+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf3f50e8-4047-48f5-9bba-ca6f4fe2d91a', '{"action":"token_revoked","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 03:40:21.803093+00', ''),
	('00000000-0000-0000-0000-000000000000', '501fdb1e-b5ed-437c-ae58-eee722e74dbd', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin.temp.1748490896863@hrportal.com","user_id":"1b196df8-1d77-44ab-8d37-81b8af730ae7","user_phone":""}}', '2025-05-29 03:54:58.170816+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d1186f3-3c8f-40d9-954c-d0e46e6bfd6b', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"admin@yourcompany.com","user_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","user_phone":""}}', '2025-05-29 03:55:31.524305+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc96761e-5f52-4d1c-a12b-05806f98142f', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"sanfa360@gmail.com","user_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","user_phone":""}}', '2025-05-29 03:55:32.021726+00', ''),
	('00000000-0000-0000-0000-000000000000', '385caefd-e383-42bb-ae0b-da316c3331e9', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:00:08.96094+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b441f5b-6853-4be3-b1d7-83e2775c1364', '{"action":"login","actor_id":"ad87c034-228d-4688-ab68-40aec27d7fc8","actor_name":"Admin User","actor_username":"admin@yourcompany.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:02:52.295668+00', ''),
	('00000000-0000-0000-0000-000000000000', '06b51d3d-4116-41e0-aece-b26250bc95d6', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:06:04.055092+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c022462-efc4-4324-a885-5a60921679a7', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:09:40.845152+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fee0bda2-59a8-4014-9cd8-3e0bea8fb06c', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:24:28.596891+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5600a6e-12e0-4a00-91fe-f9caaf6ce6d2', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:36:28.909076+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f73d2129-91d3-44d4-8443-8b675afce69f', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:37:02.977172+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e6de124-65bb-45fe-9d2d-d338a7f3267b', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:37:26.509286+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6e4c36c-3afb-4091-97b4-0be20f5bbe7e', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:47:14.373058+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbd9aca5-e7c3-4358-87c9-46b6b146676e', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:48:10.354008+00', ''),
	('00000000-0000-0000-0000-000000000000', '89578e7c-ae16-4fb7-97ef-2e646807b1bb', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:48:33.36508+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2f03456-abd8-4e0a-bc83-2ec3771e1926', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:49:40.171645+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ccfaff3-3119-4076-af14-5a5f7e2613bc', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:53:19.724733+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8e2d68c-64a7-41dc-8253-7ca698b79c64', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 04:57:07.513331+00', ''),
	('00000000-0000-0000-0000-000000000000', '37e9b606-504a-4ab7-bcda-8845a5a882ac', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:00:30.173208+00', ''),
	('00000000-0000-0000-0000-000000000000', '360bc439-7f02-48c9-9622-fec6faabe444', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:02:07.79235+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0a8652b-a97b-43c0-8164-5f29cb4d9fa2', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:03:17.794408+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e304b575-03d2-4be0-ae86-cac647940542', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:05:30.06109+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1da7723-f656-40d6-a70a-dfbc7b82957c', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:09:20.958492+00', ''),
	('00000000-0000-0000-0000-000000000000', 'baa8e69a-c3b2-4b98-ade6-fae8366046d8', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:09:50.695304+00', ''),
	('00000000-0000-0000-0000-000000000000', '23e262b4-2de3-4e0e-b6cf-37cbc497ed33', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:18:03.764685+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f323b4c-e758-4450-ae8b-1b6c679384de', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:33:32.897681+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e8bdc5f-12ef-4297-8189-8c1839f87ace', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 05:42:54.33914+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6a2111b-884e-4621-9d0a-d21f3722769a', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:05:48.675591+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adaa0789-1fb6-4996-aef3-55c4e2137d87', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:22:31.462827+00', ''),
	('00000000-0000-0000-0000-000000000000', '8cdd8d77-5f1d-4103-b367-f9565a65b56e', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 06:23:16.87064+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa914b55-6885-4091-9461-9e7091ec2c43', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 06:23:16.871239+00', ''),
	('00000000-0000-0000-0000-000000000000', '5cb7d771-f776-4a06-b931-af3acf87597d', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:23:27.775174+00', ''),
	('00000000-0000-0000-0000-000000000000', '942e410e-6879-44fd-b2ed-8be831b49f6b', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:24:11.89768+00', ''),
	('00000000-0000-0000-0000-000000000000', '88788f14-dd5b-4721-be4b-babb33f652b3', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:32:46.275757+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8adc6f9-94e1-4412-a07d-5f8d1db127f6', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:42:13.875733+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d89517a-eaa6-4429-bbe8-5f3e6082e365', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:42:35.705881+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f78709a-db59-4fba-8b7a-37b8054a7008', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:43:00.352942+00', ''),
	('00000000-0000-0000-0000-000000000000', '7525a70c-697c-44fd-b6a4-4dc762e92973', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:43:52.782458+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa55a780-4b65-4e3c-86f6-18f94e161262', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 06:45:54.386508+00', ''),
	('00000000-0000-0000-0000-000000000000', '53bc6204-a5f8-42db-adad-2c06c361c820', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 07:03:23.399069+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a950f37-b772-42f0-9fa7-fa67bf43e35f', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 07:03:23.403104+00', ''),
	('00000000-0000-0000-0000-000000000000', '624f00f9-27f8-47f4-ae72-d68de2b7fb76', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 07:04:58.425619+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff2390ec-da47-4fdc-aacb-3fec4117d2ce', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 07:05:38.76234+00', ''),
	('00000000-0000-0000-0000-000000000000', '03dca6e7-0f2a-4ff0-8074-8598e9a9686a', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 22:34:53.525109+00', ''),
	('00000000-0000-0000-0000-000000000000', '83a7239a-3476-44fa-a24d-42e9354471c6', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 22:34:53.531874+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e60cd9b6-ff05-4651-b78e-233a356c915a', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 22:37:12.648821+00', ''),
	('00000000-0000-0000-0000-000000000000', '475216ef-a718-4f2c-99a3-cf1b9910eb68', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-29 22:37:12.658472+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a45e44f4-3299-405b-b41a-b71497a2d71f', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 22:37:24.408916+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da65e6b1-78a2-44f0-8c61-051f9c2f62be', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 22:38:06.936493+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a777625-e5b3-4646-b875-4b2b1a7aaa92', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 22:38:52.540695+00', ''),
	('00000000-0000-0000-0000-000000000000', '9fed8a38-2daf-4bba-b64b-21bb2b565f41', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 22:53:04.026358+00', ''),
	('00000000-0000-0000-0000-000000000000', '1728f599-4172-4754-9903-502101143246', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 22:59:32.152898+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd11e4c9-bd6f-46f0-be39-92b3135568a3', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 23:24:23.244915+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7a6ca31-1bab-467e-b21c-74668b409cce', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 23:44:55.461087+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db5d4b74-0551-446f-8816-c8b92a726666', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-29 23:50:18.802968+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8027131-0783-49a4-9e63-e209bb8ebda9', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 00:02:41.248885+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ddc57679-fa61-4b04-9e57-f7a10d1ec65d', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 00:31:31.781459+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a57d268e-8200-4118-80a7-fb54dfca6efb', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 00:54:47.853103+00', ''),
	('00000000-0000-0000-0000-000000000000', '64e4904c-97ba-4563-a323-76b9679e73d8', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 00:54:49.543483+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f49b65df-434e-401a-941b-8a119d87d4e3', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 00:54:49.544151+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cdef7161-6ad5-4902-9f7e-c6ef71663f10', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 01:26:45.61027+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db160851-4c88-496a-b40d-107d67dfc717', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 01:28:20.829231+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c64d890-c159-46e3-b571-e8e3cd2aebdf', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 01:28:20.830717+00', ''),
	('00000000-0000-0000-0000-000000000000', '561bfc76-b217-4f2a-b04b-b4e653a193a8', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 01:28:32.300984+00', ''),
	('00000000-0000-0000-0000-000000000000', '2112b95d-6d67-4f00-a08d-5ef1a44176e0', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 01:38:53.656167+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ccad16fe-0d49-4ae1-a922-eea23af9d0cb', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 19:36:22.755518+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bcacdc81-9230-4694-bca0-b80a9320c85f', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 19:36:22.76851+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e28d5377-5211-437d-a2d8-3cafbda8cdc9', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 19:36:34.123656+00', ''),
	('00000000-0000-0000-0000-000000000000', '61874b84-cc51-40fd-9a1c-bfc60dd0adcc', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 19:36:35.695653+00', ''),
	('00000000-0000-0000-0000-000000000000', '694fe778-e4ae-4c7b-9ecd-fc19e13a18a8', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 19:36:35.696282+00', ''),
	('00000000-0000-0000-0000-000000000000', '69937bd2-cf21-48ae-995a-09ce83795fb8', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 20:29:06.631246+00', ''),
	('00000000-0000-0000-0000-000000000000', '60065c28-9a51-4283-9bc3-45cde4da00b9', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 20:41:24.85778+00', ''),
	('00000000-0000-0000-0000-000000000000', '6adb7530-3a37-41ac-9996-1df1b6298f1a', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 20:41:24.859794+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af07c1ea-5961-4b11-a132-2b17a47c6220', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 20:42:14.39029+00', ''),
	('00000000-0000-0000-0000-000000000000', '58545720-b673-4656-9e4c-ba023adcabdd', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 20:47:57.717308+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cdfbd3d3-cc66-4b9f-9bd8-3b43eb8d7d0c', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 21:13:57.094142+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dce19d92-dc9f-45fe-b3bb-70c69b1ebe12', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 21:17:35.279976+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da683b02-83c4-4218-b734-ea0ecc6b1aed', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 21:34:20.927727+00', ''),
	('00000000-0000-0000-0000-000000000000', '37b4e36c-2fd8-4791-97e4-4c12cd77e4d5', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 23:22:34.49997+00', ''),
	('00000000-0000-0000-0000-000000000000', '72fbc7e5-a7d1-443c-8bdb-c59899637c5a', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 23:22:34.50236+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a9b7f00-ed53-49c6-aeb2-87e985ec5a96', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 23:25:52.914383+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f91b69e0-e51f-4774-b060-4ca5a244415e', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 23:34:04.205703+00', ''),
	('00000000-0000-0000-0000-000000000000', '9655eb51-e970-409e-8936-43111fce6081', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 23:38:28.925335+00', ''),
	('00000000-0000-0000-0000-000000000000', '5eb169d8-9170-4c6c-a4ce-6aadbe30f877', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 23:50:28.829206+00', ''),
	('00000000-0000-0000-0000-000000000000', '37fc85a7-7f02-46a5-b6bd-1fc96321ed94', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 01:04:00.113006+00', ''),
	('00000000-0000-0000-0000-000000000000', '070ebde3-848d-4412-9666-9d5f2f18bd73', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 01:04:00.116943+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e84d4f39-93e6-47ec-84b3-f30776df44b0', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 01:08:17.938053+00', ''),
	('00000000-0000-0000-0000-000000000000', '110a3881-14f4-4337-be8a-10298482361f', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 01:11:31.972062+00', ''),
	('00000000-0000-0000-0000-000000000000', '33b58825-be44-4b00-8494-647dfcb2e97f', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 02:13:35.258241+00', ''),
	('00000000-0000-0000-0000-000000000000', '235c2145-dc1c-4c61-b75c-ee20101835e6', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 02:37:26.400449+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a9bc6d5-ee1a-4d27-a59e-d23f2fb16b4a', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 03:41:59.677516+00', ''),
	('00000000-0000-0000-0000-000000000000', '99edfdc7-677e-46fb-a91d-82f547088214', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 04:00:40.544337+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5bdb835-04bd-4492-8e3e-b9919dbee66b', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 04:33:54.287274+00', ''),
	('00000000-0000-0000-0000-000000000000', '342602ae-7abb-4c93-8556-884f8ba03d79', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 05:12:44.962393+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4f89a28-9485-41a7-9c97-1b5999a86b77', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 05:16:22.88109+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1bc71c3-0aa9-45a1-b68d-fb74b5d33fa4', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 15:35:30.120533+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c34616e8-61fc-46ba-b505-f3394ecaf812', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 15:35:30.13246+00', ''),
	('00000000-0000-0000-0000-000000000000', '2772cb96-bfb5-412f-b524-4fe6dacd9190', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 15:36:14.363403+00', ''),
	('00000000-0000-0000-0000-000000000000', '17abbd4f-783c-4dfe-9d60-b5035da35972', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 15:42:30.832462+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f00faf1-5e19-44e8-a994-5dfd9103d505', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 15:42:30.836112+00', ''),
	('00000000-0000-0000-0000-000000000000', '4112802c-aefd-4e7b-9702-b0edc3f4fdc8', '{"action":"token_refreshed","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 15:42:35.221168+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a3130e3-483b-4885-91ea-75fba5eb5c36', '{"action":"token_revoked","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-31 15:42:35.221756+00', ''),
	('00000000-0000-0000-0000-000000000000', '711c7383-9247-4c81-a15b-4f3dd13ddce7', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 16:13:32.956667+00', ''),
	('00000000-0000-0000-0000-000000000000', '35372601-88d9-4db5-8631-14ebb9edf82d', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 16:24:08.90401+00', ''),
	('00000000-0000-0000-0000-000000000000', '6291066e-9e6e-4a64-bf49-63fcc7eb0154', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 16:43:13.559369+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bad740da-c47d-43f6-b04e-04aab615e6b7', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 17:01:46.175416+00', ''),
	('00000000-0000-0000-0000-000000000000', '3985e5ac-33ef-456b-b96c-3c7c0007df60', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 17:01:59.910743+00', ''),
	('00000000-0000-0000-0000-000000000000', '55f23a28-b445-4522-b18c-09f8c74c7ed6', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 17:03:41.413989+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b8021f2-46a4-4413-b9cb-df3484e1086d', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 17:04:36.506237+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c41d0d9e-783b-44cb-98cf-d2d3e667383b', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 17:04:54.907649+00', ''),
	('00000000-0000-0000-0000-000000000000', '5896e808-bce2-4ce5-931f-a4c4170776bd', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 17:04:59.75321+00', ''),
	('00000000-0000-0000-0000-000000000000', '81417f2a-7a67-4baf-91aa-621d561b00ae', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 17:39:48.475344+00', ''),
	('00000000-0000-0000-0000-000000000000', '9db03b19-6ab3-4c14-aa18-7d1d10fd1983', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 17:40:08.193806+00', ''),
	('00000000-0000-0000-0000-000000000000', '5065b728-a3be-41d5-8ca4-7b8765486c51', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 17:40:34.466633+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd5203f7-8f57-4042-b153-bfeca65a87e0', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 17:49:20.140401+00', ''),
	('00000000-0000-0000-0000-000000000000', '651da5dd-2b09-4252-a113-901a509aa0f0', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 18:17:41.008137+00', ''),
	('00000000-0000-0000-0000-000000000000', '763da8a3-2b7e-4bf6-8b28-03d6c96560dc', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 18:22:22.434273+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c99b4194-5672-44f8-935f-bd9f930fab96', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 18:22:48.650476+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b30fb96c-9e70-4d3d-9a2e-d1486ec2ef22', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 18:32:41.915255+00', ''),
	('00000000-0000-0000-0000-000000000000', '404bb449-2e64-47fe-9bc9-624a86deebd7', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 19:07:49.492153+00', ''),
	('00000000-0000-0000-0000-000000000000', '623657a4-4c5b-4a2f-aceb-395bf07e36a6', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 19:24:12.732497+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a4f2778-96b2-4477-b211-9e10b57215b1', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 20:01:13.56812+00', ''),
	('00000000-0000-0000-0000-000000000000', '50a20320-8843-4759-aa65-1991010e9386', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 20:01:50.404463+00', ''),
	('00000000-0000-0000-0000-000000000000', '901f115d-cb20-4551-9225-3b2624b43283', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 20:02:04.770478+00', ''),
	('00000000-0000-0000-0000-000000000000', '3463fa11-7a20-43b2-8f40-3076820709ba', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 20:02:19.947878+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f2876cc-6282-4f03-8912-61e34aa1f97a', '{"action":"logout","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-31 20:02:22.970549+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f19c74de-2feb-46c4-82ec-33e1b97d2323', '{"action":"login","actor_id":"2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb","actor_username":"sanfa360@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-31 20:25:55.509565+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	(NULL, '6c112be5-4449-4adb-928c-6d5e3a4fa521', NULL, 'admin', 'admin@hrportal.com', NULL, '2025-05-27 01:27:36.963271+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0409372c-19fe-4f18-8523-4046d13780f8', 'authenticated', 'authenticated', 'manager@hrportal.com', '$2a$10$OZuGDYVGkU9PnGOdSOkzNuW5uEtqt1CI6Itys6F7bz6y4KlBLLLe6', '2025-05-29 03:21:54.768707+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "manager", "position": "Engineering Manager", "last_name": "Manager", "user_type": "manager", "department": "Engineering", "first_name": "Department", "email_verified": true}', NULL, '2025-05-29 03:21:54.760736+00', '2025-05-29 03:21:54.769447+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ad87c034-228d-4688-ab68-40aec27d7fc8', 'authenticated', 'authenticated', 'admin@yourcompany.com', '$2a$10$u/zpgu9r7wAT/EO33H9S7eC4S3SbIqmuVfozZcgR0op8wWQKnNNCO', '2025-05-27 21:12:34.412465+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-05-29 04:02:52.29665+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ad87c034-228d-4688-ab68-40aec27d7fc8", "role": "admin", "email": "admin@yourcompany.com", "company": "Your Company", "full_name": "Admin User", "email_verified": true, "phone_verified": false}', NULL, '2025-05-27 21:12:34.396313+00', '2025-05-29 04:02:52.300754+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '96793cb4-2b42-4867-b9d0-1d7f935769df', 'authenticated', 'authenticated', 'employee@hrportal.com', '$2a$10$JOQHmgz0XiTK9FshPYV10u96Q5ORAElWTGwroaKZ4weB23mrpMAL6', '2025-05-29 03:21:56.819119+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "employee", "position": "Software Developer", "last_name": "Employee", "user_type": "employee", "department": "Engineering", "first_name": "John", "email_verified": true}', NULL, '2025-05-29 03:21:56.812409+00', '2025-05-29 03:21:56.819965+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e8e2cf54-1131-4bed-be9c-8990fe584a30', 'authenticated', 'authenticated', 'hr@hrportal.com', '$2a$10$e9Ba6OrO.mhVAhyx6es3reMzYk7PzQ/9oGyhgMupl8vDq5Q36IwOS', '2025-05-29 03:21:52.772672+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "hr", "position": "HR Director", "last_name": "Manager", "user_type": "hr", "department": "Human Resources", "first_name": "HR", "email_verified": true}', NULL, '2025-05-29 03:21:52.75074+00', '2025-05-29 03:21:52.780294+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '66e4b50c-aff0-40c8-bdb1-520d6c856451', 'authenticated', 'authenticated', 'recruiter@hrportal.com', '$2a$10$gSAf2lIQhSS69Si8jncIpuyHYO0jV4Y9LfyS7WT/aI7TFevtJEs/O', '2025-05-29 03:21:59.483369+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "recruiter", "position": "Senior Recruiter", "last_name": "Recruiter", "user_type": "recruiter", "department": "Human Resources", "first_name": "Talent", "email_verified": true}', NULL, '2025-05-29 03:21:59.476027+00', '2025-05-29 03:21:59.484214+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1b196df8-1d77-44ab-8d37-81b8af730ae7', 'authenticated', 'authenticated', 'admin.temp.1748490896863@hrportal.com', '$2a$10$Tl9t7uNlKHTRBsJdjsBUEOb6BaRorBdCpLdjorZi9/0AQc9Z9SrjS', '2025-05-29 03:54:58.175152+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "last_name": "Administrator", "first_name": "System", "email_verified": true}', NULL, '2025-05-29 03:54:58.163119+00', '2025-05-29 03:54:58.176117+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', 'authenticated', 'authenticated', 'sanfa360@gmail.com', '$2a$10$TwakuCzzN6AcShlHMbw6jeymyajG0WNYMPL.c0sIJ/gLnPPlCd/rS', '2025-05-27 17:23:08.608603+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-05-31 20:25:55.512369+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb", "email": "sanfa360@gmail.com", "last_name": "Haider", "user_type": "candidate", "first_name": "Ali", "email_verified": true, "phone_verified": false}', NULL, '2025-05-27 17:20:09.986753+00', '2025-05-31 20:25:55.516536+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', '{"sub": "2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb", "email": "sanfa360@gmail.com", "last_name": "Haider", "user_type": "candidate", "first_name": "Ali", "email_verified": true, "phone_verified": false}', 'email', '2025-05-27 17:20:10.045934+00', '2025-05-27 17:20:10.045999+00', '2025-05-27 17:20:10.045999+00', 'd3a0f6f1-382a-420e-b26e-7624faf8cea5'),
	('ad87c034-228d-4688-ab68-40aec27d7fc8', 'ad87c034-228d-4688-ab68-40aec27d7fc8', '{"sub": "ad87c034-228d-4688-ab68-40aec27d7fc8", "role": "admin", "email": "admin@yourcompany.com", "company": "Your Company", "full_name": "Admin User", "email_verified": false, "phone_verified": false}', 'email', '2025-05-27 21:12:34.408933+00', '2025-05-27 21:12:34.408995+00', '2025-05-27 21:12:34.408995+00', 'd4f82771-927a-431b-ad5d-338b5c5ec209'),
	('e8e2cf54-1131-4bed-be9c-8990fe584a30', 'e8e2cf54-1131-4bed-be9c-8990fe584a30', '{"sub": "e8e2cf54-1131-4bed-be9c-8990fe584a30", "email": "hr@hrportal.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-29 03:21:52.761417+00', '2025-05-29 03:21:52.761882+00', '2025-05-29 03:21:52.761882+00', 'ecd95ecb-ed6d-41a5-bd72-c08858d9a145'),
	('0409372c-19fe-4f18-8523-4046d13780f8', '0409372c-19fe-4f18-8523-4046d13780f8', '{"sub": "0409372c-19fe-4f18-8523-4046d13780f8", "email": "manager@hrportal.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-29 03:21:54.762883+00', '2025-05-29 03:21:54.762939+00', '2025-05-29 03:21:54.762939+00', '34b49e9c-d1d5-4d09-9e7d-e3659ca30c99'),
	('96793cb4-2b42-4867-b9d0-1d7f935769df', '96793cb4-2b42-4867-b9d0-1d7f935769df', '{"sub": "96793cb4-2b42-4867-b9d0-1d7f935769df", "email": "employee@hrportal.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-29 03:21:56.815566+00', '2025-05-29 03:21:56.815621+00', '2025-05-29 03:21:56.815621+00', 'f3460496-ca0c-420c-8eba-16a7231455f0'),
	('66e4b50c-aff0-40c8-bdb1-520d6c856451', '66e4b50c-aff0-40c8-bdb1-520d6c856451', '{"sub": "66e4b50c-aff0-40c8-bdb1-520d6c856451", "email": "recruiter@hrportal.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-29 03:21:59.479299+00', '2025-05-29 03:21:59.479366+00', '2025-05-29 03:21:59.479366+00', 'c5ac3e2b-9375-4b7d-a075-3d9950a0a85b'),
	('1b196df8-1d77-44ab-8d37-81b8af730ae7', '1b196df8-1d77-44ab-8d37-81b8af730ae7', '{"sub": "1b196df8-1d77-44ab-8d37-81b8af730ae7", "email": "admin.temp.1748490896863@hrportal.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-29 03:54:58.168908+00', '2025-05-29 03:54:58.168977+00', '2025-05-29 03:54:58.168977+00', 'e1a314b4-1d0c-4ffc-b264-0dd480ba2ea9');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('312a2df6-2d31-43a4-98c0-e51bbd38da45', '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', '2025-05-31 20:01:13.5703+00', '2025-05-31 20:01:13.5703+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '103.184.1.10', NULL),
	('c064151a-8c70-4da8-9404-de53a24ccba5', '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', '2025-05-31 20:25:55.512454+00', '2025-05-31 20:25:55.512454+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '103.184.1.10', NULL),
	('fb359ad4-ab19-4e35-bc6e-5aa68cc72a8a', 'ad87c034-228d-4688-ab68-40aec27d7fc8', '2025-05-29 04:02:52.296721+00', '2025-05-29 04:02:52.296721+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '103.184.1.10', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('312a2df6-2d31-43a4-98c0-e51bbd38da45', '2025-05-31 20:01:13.576334+00', '2025-05-31 20:01:13.576334+00', 'password', 'e4177aa8-e2d4-4e06-b56b-e1a7826759ab'),
	('c064151a-8c70-4da8-9404-de53a24ccba5', '2025-05-31 20:25:55.517136+00', '2025-05-31 20:25:55.517136+00', 'password', '0f940ac5-e87d-4a2c-89f7-596f97b876b4'),
	('fb359ad4-ab19-4e35-bc6e-5aa68cc72a8a', '2025-05-29 04:02:52.302056+00', '2025-05-29 04:02:52.302056+00', 'password', '8a55324a-b033-4c28-9931-3d9e5b72f8af');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 127, 'gsnvbrje77zi', '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', false, '2025-05-31 20:01:13.574126+00', '2025-05-31 20:01:13.574126+00', NULL, '312a2df6-2d31-43a4-98c0-e51bbd38da45'),
	('00000000-0000-0000-0000-000000000000', 128, 'akt52dpmo3rh', '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', false, '2025-05-31 20:25:55.514444+00', '2025-05-31 20:25:55.514444+00', NULL, 'c064151a-8c70-4da8-9404-de53a24ccba5'),
	('00000000-0000-0000-0000-000000000000', 37, 'ickb63ysw4z3', 'ad87c034-228d-4688-ab68-40aec27d7fc8', false, '2025-05-29 04:02:52.297823+00', '2025-05-29 04:02:52.297823+00', NULL, 'fb359ad4-ab19-4e35-bc6e-5aa68cc72a8a');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "first_name", "last_name", "avatar_url", "email", "phone", "role", "department", "position", "manager_id", "hire_date", "created_at", "updated_at") VALUES
	('687db55a-e046-4372-9752-90aede138969', 'User', '', NULL, 'admin@yourcompany.com', NULL, 'admin', NULL, NULL, NULL, NULL, '2025-05-27 21:10:28.857625+00', '2025-05-27 21:15:08.984122+00'),
	('6c112be5-4449-4adb-928c-6d5e3a4fa521', 'admin', '', NULL, 'admin@hrportal.com', NULL, 'admin', NULL, NULL, NULL, NULL, '2025-05-27 20:20:53.71796+00', '2025-05-27 21:15:08.984122+00'),
	('2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb', 'Admin', 'User', NULL, 'admin.9371cbdb@hrportal.com', NULL, 'admin', 'IT', 'Administrator', NULL, NULL, '2025-05-29 04:09:56.769+00', '2025-05-29 04:09:56.769+00'),
	('00000000-0000-0000-0000-000000000002', 'HR', 'Manager', NULL, 'hr@hrportal.com', NULL, 'hr', 'Human Resources', 'HR Director', NULL, '2020-02-01', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('00000000-0000-0000-0000-000000000003', 'Engineering', 'Manager', NULL, 'manager@hrportal.com', NULL, 'manager', 'Engineering', 'Engineering Manager', NULL, '2020-03-01', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('00000000-0000-0000-0000-000000000004', 'Regular', 'Employee', NULL, 'employee@hrportal.com', NULL, 'employee', 'Engineering', 'Software Developer', NULL, '2021-01-15', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('00000000-0000-0000-0000-000000000005', 'Talent', 'Recruiter', NULL, 'recruiter@hrportal.com', NULL, 'recruiter', 'Human Resources', 'Talent Acquisition Specialist', NULL, '2021-02-15', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('00000000-0000-0000-0000-000000000001', 'Admin', 'User', NULL, 'sanfa360@gmail.com', NULL, 'admin', 'Administration', 'System Administrator', NULL, '2020-01-01', '2025-05-27 10:56:33.594305+00', '2025-05-27 17:27:23.632417+00'),
	('19b5809d-5065-406e-911a-afe376bb4845', 'ali', '', NULL, 'ali@smemail.com', NULL, 'employee', NULL, NULL, NULL, NULL, '2025-05-27 20:20:53.71796+00', '2025-05-27 20:20:53.71796+00');


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."jobs" ("id", "title", "department", "location", "type", "status", "description", "requirements", "salary_range", "benefits", "applications_count", "posted_by", "created_at", "updated_at", "closing_date", "closed_at") VALUES
	('c1836127-0422-4da4-9859-406a4b9ba620', 'Marketing Manager', 'Marketing', 'Hybrid', 'Full-time', 'open', 'Lead our marketing efforts to drive growth...', 'Experience with digital marketing, SEO, and content strategy...', '$90k - $110k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 10:56:33.594305+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('d36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'Senior Software Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'We are looking for a Senior Software Engineer to join our team...', 'At least 5 years of experience with modern JavaScript frameworks...', '$120k - $150k', NULL, 6, '00000000-0000-0000-0000-000000000005', '2025-05-27 10:56:33.594305+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('f5d349c2-c908-43d6-9e0b-d1049d5f48a2', 'Product Designer', 'Design', 'New York', 'Full-time', 'open', 'Join our design team to create beautiful user experiences...', 'Portfolio showing UX/UI work and proficiency with design tools...', '$90k - $120k', NULL, 3, '00000000-0000-0000-0000-000000000005', '2025-05-27 10:56:33.594305+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('79624dc5-aa04-4871-9009-780504876aa5', 'DevOps Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'Help us build and maintain our cloud infrastructure...', 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines...', '$110k - $140k', NULL, 1, '00000000-0000-0000-0000-000000000005', '2025-05-27 16:33:21.726881+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('10918929-76ee-4695-a4d2-c11ac11e9482', 'HR Specialist', 'Human Resources', 'New York', 'Full-time', 'open', 'Join our HR team to help with recruitment and employee relations...', 'Previous HR experience and knowledge of labor laws...', '$70k - $90k', NULL, 1, '00000000-0000-0000-0000-000000000002', '2025-05-27 16:33:21.726881+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('397e423e-07e5-4b26-b702-29bdbd46cd98', 'Senior Software Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'We are looking for a Senior Software Engineer to join our team...', 'At least 5 years of experience with modern JavaScript frameworks...', '$120k - $150k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 16:33:21.726881+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('9561393a-fa80-424e-8cfb-89b72aceaaad', 'Product Designer', 'Design', 'New York', 'Full-time', 'open', 'Join our design team to create beautiful user experiences...', 'Portfolio showing UX/UI work and proficiency with design tools...', '$90k - $120k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 16:33:21.726881+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('0edd0659-0447-42a4-8500-9880546be907', 'Marketing Manager', 'Marketing', 'Hybrid', 'Full-time', 'open', 'Lead our marketing efforts to drive growth...', 'Experience with digital marketing, SEO, and content strategy...', '$90k - $110k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 16:33:21.726881+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('eeb897f7-6bc8-468b-bfe2-1d8d74172a87', 'DevOps Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'Help us build and maintain our cloud infrastructure...', 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines...', '$110k - $140k', NULL, 2, '00000000-0000-0000-0000-000000000005', '2025-05-27 10:56:33.594305+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('4902d51b-1260-4487-a157-ed656acfec61', 'HR Specialist', 'Human Resources', 'New York', 'Full-time', 'open', 'Join our HR team to help with recruitment and employee relations...', 'Previous HR experience and knowledge of labor laws...', '$70k - $90k', NULL, 2, '00000000-0000-0000-0000-000000000002', '2025-05-27 10:56:33.594305+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('c33e3bd5-2144-4f3a-b0b2-94ac8f5b404e', 'Senior Software Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'We are looking for a Senior Software Engineer to join our team...', 'At least 5 years of experience with modern JavaScript frameworks...', '$120k - $150k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('d9d02c59-d8fc-4325-a319-5810297e5159', 'Product Designer', 'Design', 'New York', 'Full-time', 'open', 'Join our design team to create beautiful user experiences...', 'Portfolio showing UX/UI work and proficiency with design tools...', '$90k - $120k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('ec8143db-b1d0-4fa0-82d5-98020587a287', 'DevOps Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'Help us build and maintain our cloud infrastructure...', 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines...', '$110k - $140k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('a3688857-577a-41ed-b255-1b721c56d885', 'HR Specialist', 'Human Resources', 'New York', 'Full-time', 'open', 'Join our HR team to help with recruitment and employee relations...', 'Previous HR experience and knowledge of labor laws...', '$70k - $90k', NULL, 0, '00000000-0000-0000-0000-000000000002', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('8b26b4a5-1fcd-4fc0-843b-522ddbca396b', 'Marketing Manager', 'Marketing', 'Hybrid', 'Full-time', 'open', 'Lead our marketing efforts to drive growth...', 'Experience with digital marketing, SEO, and content strategy...', '$90k - $110k', NULL, 0, '00000000-0000-0000-0000-000000000005', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '2025-06-26', NULL),
	('4178533a-f366-4ea3-ba2c-97ebe69c51e9', 'Marketing Specialist', 'Marketing', 'San Francisco, CA', 'full-time', 'open', 'We''re seeking a creative Marketing Specialist to develop and execute marketing campaigns that drive brand awareness and customer engagement.', '• Bachelor''s degree in Marketing or related field
• 2+ years of marketing experience
• Experience with digital marketing tools
• Creative thinking and analytical skills
• Excellent written communication', '$55,000 - $75,000', '• Competitive salary
• Health insurance
• Stock options
• Unlimited PTO
• Modern office environment', 0, NULL, '2025-05-27 20:56:53.838909+00', '2025-05-27 20:56:53.838909+00', NULL, NULL),
	('5034ae20-358a-477f-9d08-c112cd1b47b9', 'Senior Software Developer', 'Engineering', 'Remote', 'full-time', 'open', 'We are looking for a Senior Software Developer to join our growing team. You will be responsible for developing and maintaining our web applications using modern technologies.', '• 5+ years of experience in software development
• Proficiency in React, Node.js, and TypeScript
• Experience with database design and management
• Strong problem-solving skills
• Excellent communication abilities', '$80,000 - $120,000', '• Competitive salary
• Health insurance
• Flexible working hours
• Professional development opportunities
• Remote work options', 1, NULL, '2025-05-27 20:56:53.838909+00', '2025-05-27 20:56:53.838909+00', NULL, NULL),
	('8fbf8c61-0ecb-47f2-931e-58cfa6485b85', 'HR Manager', 'Human Resources', 'New York, NY', 'full-time', 'open', 'Join our HR team as an HR Manager to help build and maintain our company culture. You will oversee recruitment, employee relations, and HR policies.', '• Bachelor''s degree in HR or related field
• 3+ years of HR management experience
• Knowledge of employment law
• Strong interpersonal skills
• Experience with HRIS systems', '$65,000 - $85,000', '• Competitive salary
• Health and dental insurance
• 401(k) matching
• Paid time off
• Professional development budget', 1, NULL, '2025-05-27 20:56:53.838909+00', '2025-05-27 20:56:53.838909+00', NULL, NULL);


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."applications" ("id", "job_id", "candidate_name", "candidate_email", "resume_url", "cover_letter", "status", "experience_years", "current_company", "notes", "applied_at", "updated_at", "reviewed_by") VALUES
	('d1376b41-a67d-41ce-9b72-e5a301b147d0', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'John Doe', 'john.doe@example.com', 'https://example.com/resumes/johndoe.pdf', NULL, 'under_review', 7, NULL, NULL, '2025-05-22 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', NULL),
	('528b92d8-f712-467b-b5d3-412e429785d5', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'Jane Smith', 'jane.smith@example.com', 'https://example.com/resumes/janesmith.pdf', NULL, 'interview_scheduled', 6, NULL, NULL, '2025-05-21 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', NULL),
	('dfd72334-5267-4f65-bee5-ec366db3dcd5', 'f5d349c2-c908-43d6-9e0b-d1049d5f48a2', 'Mike Johnson', 'mike.johnson@example.com', 'https://example.com/resumes/mikejohnson.pdf', NULL, 'under_review', 4, NULL, NULL, '2025-05-24 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', NULL),
	('b252db90-2e46-479a-aff6-ed732620718c', 'eeb897f7-6bc8-468b-bfe2-1d8d74172a87', 'Sarah Williams', 'sarah.williams@example.com', 'https://example.com/resumes/sarahwilliams.pdf', NULL, 'pending', 5, NULL, NULL, '2025-05-26 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', NULL),
	('e2a2ac99-575a-4dc6-9940-c14653f83a6a', '4902d51b-1260-4487-a157-ed656acfec61', 'David Brown', 'david.brown@example.com', 'https://example.com/resumes/davidbrown.pdf', NULL, 'under_review', 3, NULL, NULL, '2025-05-23 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', NULL),
	('9fed8d4a-99ff-4593-884a-5e98340bda01', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'John Doe', 'john.doe@example.com', 'https://example.com/resumes/johndoe.pdf', NULL, 'under_review', 7, NULL, NULL, '2025-05-22 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', NULL),
	('3120859a-6f9d-4433-b6c2-55e542974bfb', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'Jane Smith', 'jane.smith@example.com', 'https://example.com/resumes/janesmith.pdf', NULL, 'interview_scheduled', 6, NULL, NULL, '2025-05-21 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', NULL),
	('578ab9d7-f506-4998-93e9-b0ab2788c2f4', 'f5d349c2-c908-43d6-9e0b-d1049d5f48a2', 'Mike Johnson', 'mike.johnson@example.com', 'https://example.com/resumes/mikejohnson.pdf', NULL, 'under_review', 4, NULL, NULL, '2025-05-24 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', NULL),
	('2a4c93ea-d807-46e9-b857-e6fc1a261016', 'eeb897f7-6bc8-468b-bfe2-1d8d74172a87', 'Sarah Williams', 'sarah.williams@example.com', 'https://example.com/resumes/sarahwilliams.pdf', NULL, 'pending', 5, NULL, NULL, '2025-05-26 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', NULL),
	('d563602a-5b3d-4364-a894-c7e66ef883c0', '4902d51b-1260-4487-a157-ed656acfec61', 'David Brown', 'david.brown@example.com', 'https://example.com/resumes/davidbrown.pdf', NULL, 'under_review', 3, NULL, NULL, '2025-05-23 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', NULL),
	('0835a130-b84c-4dc5-a0f4-0e9b46796906', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'John Doe', 'john.doe@example.com', 'https://example.com/resumes/johndoe.pdf', NULL, 'under_review', 7, NULL, NULL, '2025-05-22 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', NULL),
	('09c5b1f8-d2ed-4d53-934a-9a1638cc8803', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'Jane Smith', 'jane.smith@example.com', 'https://example.com/resumes/janesmith.pdf', NULL, 'interview_scheduled', 6, NULL, NULL, '2025-05-21 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', NULL),
	('e16da859-1931-4439-b452-21bae51ed92e', 'f5d349c2-c908-43d6-9e0b-d1049d5f48a2', 'Mike Johnson', 'mike.johnson@example.com', 'https://example.com/resumes/mikejohnson.pdf', NULL, 'under_review', 4, NULL, NULL, '2025-05-24 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', NULL),
	('05939c75-e54d-4325-bd10-09fc56daab1e', '79624dc5-aa04-4871-9009-780504876aa5', 'Sarah Williams', 'sarah.williams@example.com', 'https://example.com/resumes/sarahwilliams.pdf', NULL, 'pending', 5, NULL, NULL, '2025-05-26 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', NULL),
	('28685f1f-1509-43d6-be2d-b0aa9fa2e828', '10918929-76ee-4695-a4d2-c11ac11e9482', 'David Brown', 'david.brown@example.com', 'https://example.com/resumes/davidbrown.pdf', NULL, 'under_review', 3, NULL, NULL, '2025-05-23 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', NULL),
	('49020dad-81fe-4a01-aa46-e46e467d0ca6', '5034ae20-358a-477f-9d08-c112cd1b47b9', 'John Doe', 'candidate1@example.com', 'https://example.com/resume1.pdf', 'I am very excited about this opportunity to join your engineering team. With over 6 years of experience in full-stack development, I believe I would be a great fit for this role.', 'pending', 6, NULL, NULL, '2025-05-27 20:56:53.838909+00', '2025-05-27 20:56:53.838909+00', NULL),
	('b35efc57-3c95-4130-9713-0e71a6554948', '8fbf8c61-0ecb-47f2-931e-58cfa6485b85', 'Jane Smith', 'candidate2@example.com', 'https://example.com/resume2.pdf', 'As an experienced HR professional with a passion for people and culture, I am thrilled to apply for the HR Manager position at your company.', 'pending', 4, NULL, NULL, '2025-05-27 20:56:53.838909+00', '2025-05-27 20:56:53.838909+00', NULL);


--
-- Data for Name: compliance_requirements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."compliance_requirements" ("id", "name", "category", "description", "status", "responsible_person", "priority", "last_review", "next_review", "created_at", "updated_at") VALUES
	('3a975c57-6999-4315-bf2c-c05b4f9fcb8e', 'Data Protection Policy', 'Privacy', 'Ensure compliance with data protection regulations', 'compliant', 'HR Manager', 'high', NULL, '2025-08-25 00:00:00+00', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('c6839fde-90d4-478f-94c7-274b22a88acd', 'Workplace Safety Audit', 'Safety', 'Regular safety audit of office premises', 'pending', 'Safety Officer', 'medium', NULL, '2025-06-26 00:00:00+00', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('b2a375ce-9558-436a-ad86-367e0f81f61f', 'Equal Employment Opportunity', 'Legal', 'Review hiring practices for EEO compliance', 'needs_attention', 'HR Director', 'high', NULL, '2025-07-26 00:00:00+00', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('77d8331d-ca55-4ef8-bee3-a72b9095a8e6', 'Data Protection Policy', 'Privacy', 'Ensure compliance with data protection regulations', 'compliant', 'HR Manager', 'high', NULL, '2025-08-25 00:00:00+00', '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00'),
	('d21db455-3952-4fd5-af3c-e60b41c34f25', 'Workplace Safety Audit', 'Safety', 'Regular safety audit of office premises', 'pending', 'Safety Officer', 'medium', NULL, '2025-06-26 00:00:00+00', '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00'),
	('721259b9-cb71-4cf8-be52-54bc3e53aefa', 'Equal Employment Opportunity', 'Legal', 'Review hiring practices for EEO compliance', 'needs_attention', 'HR Director', 'high', NULL, '2025-07-26 00:00:00+00', '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00'),
	('cdce799d-a3e8-4a62-99a4-13370edb285e', 'Data Protection Policy', 'Privacy', 'Ensure compliance with data protection regulations', 'compliant', 'HR Manager', 'high', NULL, '2025-08-25 00:00:00+00', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00'),
	('9317a48e-3964-4d2d-8374-8a281d8c0d7c', 'Workplace Safety Audit', 'Safety', 'Regular safety audit of office premises', 'pending', 'Safety Officer', 'medium', NULL, '2025-06-26 00:00:00+00', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00'),
	('a2dfa787-bf46-4d9d-bef6-828c83c119d4', 'Equal Employment Opportunity', 'Legal', 'Review hiring practices for EEO compliance', 'needs_attention', 'HR Director', 'high', NULL, '2025-07-26 00:00:00+00', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00');


--
-- Data for Name: audits; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: company_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."company_settings" ("id", "name", "industry", "size", "address", "phone", "email", "website", "description", "logo_url", "timezone", "currency", "date_format", "working_days", "working_hours_start", "working_hours_end", "leave_policy", "probation_period_months", "notice_period_days", "created_at", "updated_at") VALUES
	('fb8ee7ec-6587-4c25-a333-f24081481ed9', 'Acme Corporation', 'Technology', '101-500', '123 Business Street, Tech City, TC 12345', '+1 (555) 123-4567', 'contact@acme.com', 'https://acme.com', 'Leading technology company providing innovative solutions for modern businesses.', 'https://via.placeholder.com/200x60/2563eb/ffffff?text=ACME', 'America/New_York', 'USD', 'MM/DD/YYYY', '{Monday,Tuesday,Wednesday,Thursday,Friday}', '09:00', '17:00', NULL, 3, 30, '2025-05-27 01:27:36.963271+00', '2025-05-27 01:27:36.963271+00');


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employees" ("id", "profile_id", "employee_id", "status", "salary", "location", "start_date", "end_date", "employment_type", "emergency_contact_name", "emergency_contact_phone", "created_at", "updated_at") VALUES
	('7598015e-4496-43c6-98f2-916a3e159faf', '00000000-0000-0000-0000-000000000001', 'EMP001', 'active', 120000, 'New York', '2020-01-01', NULL, 'Full-time', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('5b993655-965e-4b45-bacd-5ee4508e8ca4', '00000000-0000-0000-0000-000000000002', 'EMP002', 'active', 110000, 'New York', '2020-02-01', NULL, 'Full-time', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('b22ee732-fb95-4283-824c-87ab77585ee6', '00000000-0000-0000-0000-000000000003', 'EMP003', 'active', 115000, 'Remote', '2020-03-01', NULL, 'Full-time', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('a9df9282-1956-42fd-9e5d-f1a066502828', '00000000-0000-0000-0000-000000000004', 'EMP004', 'active', 95000, 'Remote', '2021-01-15', NULL, 'Full-time', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('68dc9a56-bb8d-4a37-884b-a84f578029ff', '00000000-0000-0000-0000-000000000005', 'EMP005', 'active', 85000, 'New York', '2021-02-15', NULL, 'Full-time', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00');


--
-- Data for Name: training_courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."training_courses" ("id", "title", "category", "description", "duration", "instructor", "capacity", "enrolled", "status", "start_date", "end_date", "price", "location", "created_at", "updated_at", "created_by") VALUES
	('d0906a01-6c52-4a2a-b929-278671d98dd0', 'Leadership Skills', 'Professional Development', 'Learn essential leadership skills for the modern workplace', '2 days', 'Jennifer Lee', 20, 1, 'active', '2025-06-26', '2025-06-28', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', '00000000-0000-0000-0000-000000000002'),
	('a2524ec5-c0d5-46e5-85dd-5e09bb45c6be', 'Advanced JavaScript', 'Technical', 'Deep dive into modern JavaScript features and frameworks', '4 weeks', 'Michael Chen', 15, 1, 'active', '2025-06-10', '2025-07-08', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', '00000000-0000-0000-0000-000000000003'),
	('af6a1c85-a91d-4f72-a373-2a288cd4c9c4', 'Workplace Safety', 'Compliance', 'Essential safety training for all employees', '1 day', 'Robert Johnson', 30, 0, 'active', '2025-06-03', '2025-06-04', NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00', '00000000-0000-0000-0000-000000000002'),
	('89cba73e-9e86-41ff-b883-26bb6078921c', 'Leadership Skills', 'Professional Development', 'Learn essential leadership skills for the modern workplace', '2 days', 'Jennifer Lee', 20, 0, 'active', '2025-06-26', '2025-06-28', NULL, NULL, '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', '00000000-0000-0000-0000-000000000002'),
	('0275d1ea-9bdb-4fd7-8f3f-2c936edf9780', 'Advanced JavaScript', 'Technical', 'Deep dive into modern JavaScript features and frameworks', '4 weeks', 'Michael Chen', 15, 0, 'active', '2025-06-10', '2025-07-08', NULL, NULL, '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', '00000000-0000-0000-0000-000000000003'),
	('fff43a67-0dbb-41a2-9606-672723e4d4bc', 'Workplace Safety', 'Compliance', 'Essential safety training for all employees', '1 day', 'Robert Johnson', 30, 0, 'active', '2025-06-03', '2025-06-04', NULL, NULL, '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00', '00000000-0000-0000-0000-000000000002'),
	('c844dcba-f4f1-48c9-baaa-087db700ed5b', 'Leadership Skills', 'Professional Development', 'Learn essential leadership skills for the modern workplace', '2 days', 'Jennifer Lee', 20, 0, 'active', '2025-06-26', '2025-06-28', NULL, NULL, '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '00000000-0000-0000-0000-000000000002'),
	('e909fee0-532f-4dd8-badb-af8804c96e33', 'Advanced JavaScript', 'Technical', 'Deep dive into modern JavaScript features and frameworks', '4 weeks', 'Michael Chen', 15, 0, 'active', '2025-06-10', '2025-07-08', NULL, NULL, '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '00000000-0000-0000-0000-000000000003'),
	('6c571bb8-0206-4264-b534-bf0855fe6ebe', 'Workplace Safety', 'Compliance', 'Essential safety training for all employees', '1 day', 'Robert Johnson', 30, 0, 'active', '2025-06-03', '2025-06-04', NULL, NULL, '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00', '00000000-0000-0000-0000-000000000002');


--
-- Data for Name: course_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."course_enrollments" ("id", "course_id", "employee_id", "status", "enrolled_at", "completed_at", "completion_score", "feedback") VALUES
	('4972976c-2222-4b3a-ba55-1b7305c105da', 'a2524ec5-c0d5-46e5-85dd-5e09bb45c6be', 'a9df9282-1956-42fd-9e5d-f1a066502828', 'enrolled', '2025-05-25 10:56:33.594305+00', NULL, NULL, NULL),
	('ee6b08cc-1dfb-4c9b-aee7-956ded8249be', 'd0906a01-6c52-4a2a-b929-278671d98dd0', 'b22ee732-fb95-4283-824c-87ab77585ee6', 'enrolled', '2025-05-24 10:56:33.594305+00', NULL, NULL, NULL);


--
-- Data for Name: dashboard_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."departments" ("id", "name", "description", "manager_id", "created_at", "updated_at") VALUES
	('1c580c42-fd96-4ff7-a655-8332910f48b8', 'Human Resources', 'HR department responsible for personnel management', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('808e72ce-6f05-4ac0-8797-9e52307f6381', 'Finance', 'Finance and accounting department', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('165cfb48-1fb9-496e-b626-2f01fa146fd9', 'Engineering', 'Software engineering and development', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('596ac33b-36c7-4c62-b6ec-ae1aa8db868f', 'Marketing', 'Marketing and communications', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('6838012f-6394-4e20-9c16-b5529b95d2c2', 'Sales', 'Sales and business development', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('82daea7c-863a-4317-89c0-2d02a7c0bcfa', 'Operations', 'Business operations', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('422c7528-df9d-40a0-a4e5-095a870bb884', 'Customer Support', 'Customer service and support', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('c9cef867-1cec-43d3-8a5d-4f74b6951278', 'Research & Development', 'Product innovation and research', '00000000-0000-0000-0000-000000000002', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00');


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: employee_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: equipment_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: equipment_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: equipment_inspections; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."expenses" ("id", "employee_id", "category", "amount", "currency", "description", "date", "status", "receipt_url", "submitted_at", "approved_at", "rejected_at", "rejection_reason", "approver_id") VALUES
	('8022b71b-61ee-4ea7-b266-f4c1de4ea1a9', 'b22ee732-fb95-4283-824c-87ab77585ee6', 'Travel', 450.75, 'USD', 'Client meeting in Boston', '2025-05-17', 'approved', 'https://example.com/receipts/travel-boston.pdf', '2025-05-27 10:56:33.594305+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002'),
	('4bc8d18f-9900-40e4-8b0a-d68059357177', 'a9df9282-1956-42fd-9e5d-f1a066502828', 'Equipment', 899.99, 'USD', 'New laptop for development work', '2025-05-22', 'pending', 'https://example.com/receipts/laptop-purchase.pdf', '2025-05-27 10:56:33.594305+00', NULL, NULL, NULL, NULL),
	('17d010ff-b8ec-4c0c-ae8b-d5c800908ec6', 'b22ee732-fb95-4283-824c-87ab77585ee6', 'Travel', 450.75, 'USD', 'Client meeting in Boston', '2025-05-17', 'approved', 'https://example.com/receipts/travel-boston.pdf', '2025-05-27 16:33:21.726881+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002'),
	('3d947d03-9e10-485f-9f89-2530bd1008bb', 'a9df9282-1956-42fd-9e5d-f1a066502828', 'Equipment', 899.99, 'USD', 'New laptop for development work', '2025-05-22', 'pending', 'https://example.com/receipts/laptop-purchase.pdf', '2025-05-27 16:33:21.726881+00', NULL, NULL, NULL, NULL),
	('179fd2b0-824e-4de0-a64e-fc13ceae381c', 'b22ee732-fb95-4283-824c-87ab77585ee6', 'Travel', 450.75, 'USD', 'Client meeting in Boston', '2025-05-17', 'approved', 'https://example.com/receipts/travel-boston.pdf', '2025-05-27 17:17:26.25866+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002'),
	('7dc50ade-95e0-4f1c-ad8e-01a2e1744d2d', 'a9df9282-1956-42fd-9e5d-f1a066502828', 'Equipment', 899.99, 'USD', 'New laptop for development work', '2025-05-22', 'pending', 'https://example.com/receipts/laptop-purchase.pdf', '2025-05-27 17:17:26.25866+00', NULL, NULL, NULL, NULL);


--
-- Data for Name: interviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."interviews" ("id", "application_id", "interviewer_id", "candidate_name", "candidate_email", "position", "job_id", "stage", "type", "scheduled_at", "duration", "location", "notes", "status", "feedback", "created_at", "updated_at") VALUES
	('1ee2f13b-a2e4-4004-8194-39c314bda1b9', '528b92d8-f712-467b-b5d3-412e429785d5', '00000000-0000-0000-0000-000000000003', 'Jane Smith', 'jane.smith@example.com', 'Senior Software Engineer', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'technical', 'video', '2025-05-29 10:56:33.594305+00', 60, 'video-zoom', NULL, 'scheduled', NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('93a4d1fe-d96b-445a-8f45-e4b3942857b7', '528b92d8-f712-467b-b5d3-412e429785d5', '00000000-0000-0000-0000-000000000003', 'Jane Smith', 'jane.smith@example.com', 'Senior Software Engineer', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'technical', 'video', '2025-05-29 16:33:21.726881+00', 60, 'video-zoom', NULL, 'scheduled', NULL, '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00'),
	('f168f378-38cd-47cf-a38a-56535c748e70', '528b92d8-f712-467b-b5d3-412e429785d5', '00000000-0000-0000-0000-000000000003', 'Jane Smith', 'jane.smith@example.com', 'Senior Software Engineer', 'd36436b6-34f7-4bbf-80ba-fbbe68341cc9', 'technical', 'video', '2025-05-29 17:17:26.25866+00', 60, 'video-zoom', NULL, 'scheduled', NULL, '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00');


--
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."leave_types" ("id", "name", "description", "default_days", "requires_approval", "color", "created_at") VALUES
	('27be6e2c-6de3-41ef-9e40-e275441edbba', 'Annual Leave', 'Regular vacation days', 20, true, '#4CAF50', '2025-05-31 01:42:41.970193+00'),
	('63355b99-97fc-4614-a132-5995727b6de8', 'Sick Leave', 'Leave due to illness', 10, true, '#F44336', '2025-05-31 01:42:41.970193+00'),
	('9e31b827-d36a-4f09-b30b-c61cb635f30c', 'Personal Leave', 'Leave for personal matters', 5, true, '#2196F3', '2025-05-31 01:42:41.970193+00'),
	('e135eec6-353f-4618-9891-c2ae82669689', 'Maternity Leave', 'Leave for childbirth and care', 90, true, '#9C27B0', '2025-05-31 01:42:41.970193+00'),
	('a45f8000-3842-473d-9f8b-4b6768e0db48', 'Paternity Leave', 'Leave for fathers after childbirth', 14, true, '#673AB7', '2025-05-31 01:42:41.970193+00'),
	('ef05a74c-cc91-41dc-a418-be8a0bc990fa', 'Bereavement Leave', 'Leave due to death of family member', 5, true, '#607D8B', '2025-05-31 01:42:41.970193+00'),
	('61901759-7214-4666-b2ce-58408eecb1d0', 'Study Leave', 'Leave for educational purposes', 10, true, '#FF9800', '2025-05-31 01:42:41.970193+00');


--
-- Data for Name: leave_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."leave_requests" ("id", "employee_id", "type", "start_date", "end_date", "days", "status", "reason", "created_at", "approved_at", "rejected_at", "rejection_reason", "manager_id") VALUES
	('15c8b811-77e8-488c-8cf3-79bb2165468e', 'a9df9282-1956-42fd-9e5d-f1a066502828', 'Annual Leave', '2025-06-10', '2025-06-17', 5, 'pending', 'Family vacation', '2025-05-27 10:56:33.594305+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000003'),
	('cc1e04e6-df0f-4702-8260-9f74b4e8c062', '68dc9a56-bb8d-4a37-884b-a84f578029ff', 'Sick Leave', '2025-05-22', '2025-05-24', 3, 'approved', 'Flu', '2025-05-27 10:56:33.594305+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002'),
	('7d6043f6-c256-4430-9f1d-cdcae8bef674', 'a9df9282-1956-42fd-9e5d-f1a066502828', 'Annual Leave', '2025-06-10', '2025-06-17', 5, 'pending', 'Family vacation', '2025-05-27 16:33:21.726881+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000003'),
	('a410a49b-d54f-43d9-8627-07529c880ab5', '68dc9a56-bb8d-4a37-884b-a84f578029ff', 'Sick Leave', '2025-05-22', '2025-05-24', 3, 'approved', 'Flu', '2025-05-27 16:33:21.726881+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002'),
	('289af267-5c6c-4c6c-87a4-7bbbca81d225', 'a9df9282-1956-42fd-9e5d-f1a066502828', 'Annual Leave', '2025-06-10', '2025-06-17', 5, 'pending', 'Family vacation', '2025-05-27 17:17:26.25866+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000003'),
	('91b49b5e-8360-40db-890c-1338fbfbcd58', '68dc9a56-bb8d-4a37-884b-a84f578029ff', 'Sick Leave', '2025-05-22', '2025-05-24', 3, 'approved', 'Flu', '2025-05-27 17:17:26.25866+00', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002');


--
-- Data for Name: loan_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."loan_programs" ("id", "name", "description", "max_amount", "interest_rate", "max_term_months", "minimum_service_months", "status", "created_at", "updated_at") VALUES
	('39bdf136-cb5c-478d-bc68-3e444bda2023', 'Personal Loan', 'General purpose personal loan', 10000.00, 5.00, 24, 6, 'active', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('897423f4-4d97-483c-afda-863f69ce9fcd', 'Education Loan', 'Loan for higher education', 25000.00, 3.50, 36, 12, 'active', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('eda464f0-c7fb-4023-837f-5fa639e35c02', 'Home Loan', 'Loan for home purchase or renovation', 50000.00, 4.00, 60, 24, 'active', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('ec89d0e3-4a21-47cd-bb4f-f8d70f0acdf7', 'Emergency Loan', 'Loan for urgent financial needs', 5000.00, 2.00, 12, 3, 'active', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('2793db03-1ac1-4932-b8c9-8e8d17053793', 'Vehicle Loan', 'Loan for vehicle purchase', 15000.00, 4.50, 36, 12, 'active', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00');


--
-- Data for Name: loan_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: loan_repayments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: meeting_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."meeting_rooms" ("id", "name", "location", "capacity", "features", "status", "created_at", "updated_at") VALUES
	('53dd5b4d-7acc-450b-96ca-27d4f4078c8b', 'Executive Suite', 'Floor 5', 20, '{Projector,"Video Conference",Whiteboard,Catering}', 'available', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('a35c82fa-940d-422b-bbc7-78366d2f9e10', 'Boardroom', 'Floor 4', 12, '{Projector,"Video Conference",Whiteboard}', 'available', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('dd682c3c-a964-4e73-9500-79d2fbbed098', 'Huddle Room 1', 'Floor 3', 6, '{"Video Conference",Whiteboard}', 'available', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('9631a9bc-c236-475a-aff6-8fa195667106', 'Huddle Room 2', 'Floor 3', 6, '{"Video Conference",Whiteboard}', 'available', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('d3aa4af1-ebe5-4c04-918c-407601cc7f37', 'Conference Room A', 'Floor 2', 15, '{Projector,"Video Conference",Whiteboard}', 'available', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('0eaa3e2c-bedc-43b2-aa86-d30b9244253e', 'Conference Room B', 'Floor 2', 15, '{Projector,"Video Conference",Whiteboard}', 'available', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('aa93db8b-6c79-41e1-97f8-c74de51093ce', 'Training Room', 'Floor 1', 30, '{Projector,"Video Conference",Whiteboard,"Computer Stations"}', 'available', '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "user_id", "title", "message", "type", "read", "link", "created_at") VALUES
	('41f260ab-725b-464e-8006-465df3f8af24', '00000000-0000-0000-0000-000000000004', 'Performance Review Scheduled', 'Your performance review for Q3 has been scheduled for next week', 'info', false, NULL, '2025-05-27 10:56:33.594305+00'),
	('a0bc542f-ebdf-4403-ba9b-597b792343fc', '00000000-0000-0000-0000-000000000003', 'New Leave Request', 'You have a new leave request to approve', 'warning', false, NULL, '2025-05-27 10:56:33.594305+00'),
	('dd501ccc-fa12-4452-a851-c2aec4a2fcf1', '00000000-0000-0000-0000-000000000004', 'Performance Review Scheduled', 'Your performance review for Q3 has been scheduled for next week', 'info', false, NULL, '2025-05-27 16:33:21.726881+00'),
	('41bc8eaa-b54b-4642-a39c-c2875b766d51', '00000000-0000-0000-0000-000000000003', 'New Leave Request', 'You have a new leave request to approve', 'warning', false, NULL, '2025-05-27 16:33:21.726881+00'),
	('b5e157fb-3c07-4532-a425-5ef703bfe826', '00000000-0000-0000-0000-000000000004', 'Performance Review Scheduled', 'Your performance review for Q3 has been scheduled for next week', 'info', false, NULL, '2025-05-27 17:17:26.25866+00'),
	('fc7e66e3-7d35-4e5e-8e8c-58ff4d662dea', '00000000-0000-0000-0000-000000000003', 'New Leave Request', 'You have a new leave request to approve', 'warning', false, NULL, '2025-05-27 17:17:26.25866+00');


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: performance_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."performance_reviews" ("id", "employee_id", "reviewer_id", "period", "status", "overall_rating", "goals_met", "strengths", "areas_for_improvement", "comments", "created_at", "completed_at", "next_review") VALUES
	('6d198725-4969-4cc1-bc12-691a71301a98', 'a9df9282-1956-42fd-9e5d-f1a066502828', '00000000-0000-0000-0000-000000000003', '2023 Q2', 'completed', 4.2, NULL, NULL, NULL, NULL, '2025-05-27 10:56:33.594305+00', NULL, '2025-11-27'),
	('cc750e8e-a181-4b74-94e3-cbf625d57ebe', '68dc9a56-bb8d-4a37-884b-a84f578029ff', '00000000-0000-0000-0000-000000000002', '2023 Q2', 'completed', 3.8, NULL, NULL, NULL, NULL, '2025-05-27 10:56:33.594305+00', NULL, '2025-11-27'),
	('f246db9a-a749-4f37-abf5-9bd888221940', 'a9df9282-1956-42fd-9e5d-f1a066502828', '00000000-0000-0000-0000-000000000003', '2023 Q2', 'completed', 4.2, NULL, NULL, NULL, NULL, '2025-05-27 16:33:21.726881+00', NULL, '2025-11-27'),
	('f83cf629-833a-4da3-a66a-7ff3d9e300a9', '68dc9a56-bb8d-4a37-884b-a84f578029ff', '00000000-0000-0000-0000-000000000002', '2023 Q2', 'completed', 3.8, NULL, NULL, NULL, NULL, '2025-05-27 16:33:21.726881+00', NULL, '2025-11-27'),
	('6fdf7289-a73f-4546-80f8-9b400a30942e', 'a9df9282-1956-42fd-9e5d-f1a066502828', '00000000-0000-0000-0000-000000000003', '2023 Q2', 'completed', 4.2, NULL, NULL, NULL, NULL, '2025-05-27 17:17:26.25866+00', NULL, '2025-11-27'),
	('0c06395a-eb12-4b24-b64b-2041bcaa9831', '68dc9a56-bb8d-4a37-884b-a84f578029ff', '00000000-0000-0000-0000-000000000002', '2023 Q2', 'completed', 3.8, NULL, NULL, NULL, NULL, '2025-05-27 17:17:26.25866+00', NULL, '2025-11-27');


--
-- Data for Name: request_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."request_categories" ("id", "name", "description", "icon", "sort_order", "created_at") VALUES
	('e4289cb0-fe07-4a85-aaff-eaafa26609de', 'Time & Leave', 'Time off and schedule-related requests', 'calendar', 1, '2025-05-31 01:42:41.970193+00'),
	('6f2a96e6-b6ff-4b42-84d0-6ba5066191ac', 'Finance & Benefits', 'Salary, benefits and finance-related requests', 'dollar-sign', 2, '2025-05-31 01:42:41.970193+00'),
	('e6d26db0-cd6e-4bf6-aec2-611e2df1803b', 'Equipment & Resources', 'Office supplies and resources', 'briefcase', 3, '2025-05-31 01:42:41.970193+00'),
	('97ea91f3-c412-4aff-9d7b-0232345ed0d7', 'Career & Development', 'Career growth and learning opportunities', 'award', 4, '2025-05-31 01:42:41.970193+00'),
	('1561eb39-a09e-41b7-aef3-f27da93bd4c3', 'Administrative', 'General administrative requests', 'file-text', 5, '2025-05-31 01:42:41.970193+00'),
	('79d932dc-4c7a-4457-bef1-720427acaf51', 'Health & Wellness', 'Health and wellness related requests', 'heart', 6, '2025-05-31 01:42:41.970193+00');


--
-- Data for Name: request_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."request_types" ("id", "category_id", "name", "description", "form_schema", "requires_approval", "approver_role", "sla_hours", "icon", "created_at", "updated_at") VALUES
	('2fe27163-9bb4-4674-a44c-faf3266d8f20', '6f2a96e6-b6ff-4b42-84d0-6ba5066191ac', 'Payslip Request', 'Request for payslip document', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', false, '{hr}', 24, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('818c33c4-76fa-443b-9818-0a3bdb5f9e7a', '6f2a96e6-b6ff-4b42-84d0-6ba5066191ac', 'Salary Revision Request', 'Request for salary review', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 120, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('94a9789c-2bdd-4698-aed7-3fe6e6867931', '6f2a96e6-b6ff-4b42-84d0-6ba5066191ac', 'Bonus/Incentive Request', 'Request for performance bonus', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('07a6df90-0f14-49cb-9fdc-76ac4f538308', 'e6d26db0-cd6e-4bf6-aec2-611e2df1803b', 'Parking Spot Request', 'Request for parking spot', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{admin}', 48, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('bb1290c9-1edf-4686-bd53-6fa0b474ea6e', 'e6d26db0-cd6e-4bf6-aec2-611e2df1803b', 'ID Card Request', 'Request for new ID card', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{hr,admin}', 48, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('16b6bfe7-fcdb-4a95-b26a-aa40251e0f85', 'e6d26db0-cd6e-4bf6-aec2-611e2df1803b', 'Stationary Request', 'Request for office supplies', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', false, '{admin}', 24, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('c237e3ec-9b8c-4269-960a-9b5845a0b8f2', '97ea91f3-c412-4aff-9d7b-0232345ed0d7', 'Training Request', 'Request for professional training', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('6995bfdf-01c5-4798-a9ea-1cba758776ce', '97ea91f3-c412-4aff-9d7b-0232345ed0d7', 'Certification Request', 'Request for certification program', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('cdf8bb2b-062e-4073-bf82-e180c4f5c5f4', '97ea91f3-c412-4aff-9d7b-0232345ed0d7', 'Promotion Request', 'Request for role promotion', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 168, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('496ad705-3455-4c64-b33e-2809da970376', '97ea91f3-c412-4aff-9d7b-0232345ed0d7', 'Department Transfer Request', 'Request for department change', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 168, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('3af6a4a8-3994-4bd6-9041-dd6127ac0dd1', '1561eb39-a09e-41b7-aef3-f27da93bd4c3', 'Document Request', 'Request for official documents', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{hr}', 48, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('cb62e282-6f0c-43a3-bc72-0f4214145424', '1561eb39-a09e-41b7-aef3-f27da93bd4c3', 'Grievance/Complaint', 'File a workplace complaint', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{hr}', 48, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('4ad8355d-fee6-44bc-a7a3-1d3cc85d9961', '1561eb39-a09e-41b7-aef3-f27da93bd4c3', 'Reference Letter Request', 'Request for reference letter', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('e0b45799-d917-44f6-8ec1-0c9fd2b7d8b6', '1561eb39-a09e-41b7-aef3-f27da93bd4c3', 'Employment Verification Request', 'Request for employment verification', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', false, '{hr}', 48, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('5625ab92-3023-4147-8a63-fabb38596ffd', '1561eb39-a09e-41b7-aef3-f27da93bd4c3', 'Resignation Request', 'Submit resignation notice', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 24, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('940f0b22-3c39-4d3f-be15-1cbc206116b3', '79d932dc-4c7a-4457-bef1-720427acaf51', 'Medical Leave Request', 'Request for extended medical leave', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{manager,hr}', 24, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('ed7bdc7a-8f25-473a-adf9-001f1cf2cbbc', '79d932dc-4c7a-4457-bef1-720427acaf51', 'Medical Reimbursement', 'Request for medical expense reimbursement', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{hr,finance}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('01e2fb28-982e-4861-a3c7-ee4fd10e804f', '79d932dc-4c7a-4457-bef1-720427acaf51', 'Insurance Claim', 'Submit health insurance claim', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{hr}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('f0b069ec-7ae2-450c-8dc9-03a6d638dda9', '79d932dc-4c7a-4457-bef1-720427acaf51', 'Wellness Program Enrollment', 'Enroll in company wellness program', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', false, '{hr}', 48, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('66bff4b8-f115-4653-91d6-99689ecbc753', '79d932dc-4c7a-4457-bef1-720427acaf51', 'Gym Membership Request', 'Request for gym membership subsidy', '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}', true, '{hr}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('9881ce9c-613e-42f3-9fbd-9ba59791957e', '6f2a96e6-b6ff-4b42-84d0-6ba5066191ac', 'Loan Application', 'Apply for a company loan', '{"fields": [{"name": "loanAmount", "type": "number", "label": "Loan Amount", "required": true}, {"name": "loanPurpose", "type": "textarea", "label": "Purpose", "required": true}, {"name": "repaymentMonths", "type": "number", "label": "Repayment Term (months)", "required": true}]}', true, '{hr,finance}', 72, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('cbf7427a-bd92-428b-a6d0-6429ff6605af', 'e6d26db0-cd6e-4bf6-aec2-611e2df1803b', 'Equipment Request', 'Request for new equipment', '{"fields": [{"name": "equipmentType", "type": "select", "label": "Equipment Type", "options": ["Laptop", "Monitor", "Keyboard", "Mouse", "Headset", "Other"], "required": true}, {"name": "otherEquipment", "type": "text", "label": "If Other, please specify", "required": false}, {"name": "reason", "type": "textarea", "label": "Reason", "required": true}]}', true, '{manager,it}', 48, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('7732cd6e-4110-47a7-916c-c4b6ba4f6d35', 'e4289cb0-fe07-4a85-aaff-eaafa26609de', 'Work From Home Request', 'Request to work remotely', '{"fields": [{"name": "startDate", "type": "date", "label": "Start Date", "required": true}, {"name": "endDate", "type": "date", "label": "End Date", "required": true}, {"name": "reason", "type": "textarea", "label": "Reason", "required": true}]}', true, '{manager}', 8, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('661f83fc-cd64-4286-b3a8-b82c908dd4e0', 'e6d26db0-cd6e-4bf6-aec2-611e2df1803b', 'Room Booking', 'Book a meeting room', '{"fields": [{"name": "roomId", "type": "select", "label": "Meeting Room", "options": ["Executive Suite", "Boardroom", "Huddle Room 1", "Huddle Room 2", "Conference Room A", "Conference Room B", "Training Room"], "required": true}, {"name": "startTime", "type": "datetime", "label": "Start Time", "required": true}, {"name": "endTime", "type": "datetime", "label": "End Time", "required": true}, {"name": "attendees", "type": "textarea", "label": "Attendees", "required": true}, {"name": "purpose", "type": "text", "label": "Meeting Purpose", "required": true}]}', false, NULL, 2, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('22b8f4fe-0eef-4ef3-b307-02844664cb2e', 'e4289cb0-fe07-4a85-aaff-eaafa26609de', 'Compensatory Off Request', 'Request time off for overtime worked', '{"fields": [{"name": "startDate", "type": "date", "label": "Start Date", "required": true}, {"name": "endDate", "type": "date", "label": "End Date", "required": true}, {"name": "reason", "type": "textarea", "label": "Reason", "required": true}]}', true, '{manager}', 24, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('de7b76da-a1ec-409f-b2da-a24c7296ce7d', 'e4289cb0-fe07-4a85-aaff-eaafa26609de', 'Sick Leave', 'Request for sick days', '{"fields": [{"name": "startDate", "type": "date", "label": "Start Date", "required": true}, {"name": "endDate", "type": "date", "label": "End Date", "required": true}, {"name": "totalDays", "type": "number", "label": "Total Days", "required": true}, {"name": "reason", "type": "textarea", "label": "Reason", "required": true}, {"name": "medicalCertificate", "type": "boolean", "label": "Medical Certificate Attached", "required": false}]}', true, '{manager,hr}', 4, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('282dbaf3-2c5f-424d-85e0-49a5c957f607', 'e4289cb0-fe07-4a85-aaff-eaafa26609de', 'Vacation Request', 'Request for vacation days', '{"fields": [{"name": "leaveType", "type": "select", "label": "Leave Type", "options": ["Annual Leave", "Sick Leave", "Personal Leave", "Bereavement Leave", "Study Leave", "Maternity Leave", "Paternity Leave"], "required": true}, {"name": "startDate", "type": "date", "label": "Start Date", "required": true}, {"name": "endDate", "type": "date", "label": "End Date", "required": true}, {"name": "totalDays", "type": "number", "label": "Total Days", "required": true}, {"name": "reason", "type": "textarea", "label": "Reason", "required": true}, {"name": "handoverNotes", "type": "textarea", "label": "Handover Notes", "required": false}]}', true, '{manager,hr}', 24, NULL, '2025-05-31 01:42:41.970193+00', '2025-05-31 01:42:41.970193+00'),
	('86b117d0-990b-48d6-b7b7-cc65e831e1f0', 'e4289cb0-fe07-4a85-aaff-eaafa26609de', 'Leave/Time-off Request', 'Request for any type of leave or time off', '{"fields": [{"name": "leaveType", "type": "select", "label": "Leave Type", "options": ["Annual Leave", "Sick Leave", "Personal Leave", "Bereavement Leave", "Study Leave", "Maternity Leave", "Paternity Leave"], "required": true}, {"name": "startDate", "type": "date", "label": "Start Date", "required": true}, {"name": "endDate", "type": "date", "label": "End Date", "required": true}, {"name": "totalDays", "type": "number", "label": "Total Days", "required": true}, {"name": "reason", "type": "textarea", "label": "Reason", "required": true}, {"name": "handoverNotes", "type": "textarea", "label": "Handover Notes", "required": false}]}', true, '{manager,hr}', 24, NULL, '2025-05-31 02:24:47.653908+00', '2025-05-31 02:24:47.653908+00');


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: room_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: safety_checks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."safety_checks" ("id", "title", "due_date", "status", "assigned_to", "location", "frequency", "last_completed", "notes", "priority", "created_at", "updated_at") VALUES
	('57160f26-244d-4c77-8718-2974257ad6f8', 'Fire Extinguisher Inspection', '2025-06-10', 'Scheduled', 'Facilities Manager', 'All Offices', 'Monthly', NULL, NULL, 'High', '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('1b78cebf-45b4-47b6-9069-598707b03c60', 'Fire Extinguisher Inspection', '2025-06-10', 'Scheduled', 'Facilities Manager', 'All Offices', 'Monthly', NULL, NULL, 'High', '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00'),
	('a8e88ef1-2205-4829-8201-e19607a1a918', 'Fire Extinguisher Inspection', '2025-06-10', 'Scheduled', 'Facilities Manager', 'All Offices', 'Monthly', NULL, NULL, 'High', '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00');


--
-- Data for Name: safety_check_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: safety_equipment_checks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: safety_incidents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."safety_incidents" ("id", "title", "description", "date", "location", "reported_by", "severity", "status", "type", "injury_type", "medical_attention", "witnesses", "follow_up_actions", "resolution_date", "attachments", "created_at", "updated_at") VALUES
	('0171bc08-2371-47f6-bd44-0bb440905542', 'Office Slip', 'Employee slipped on wet floor in break room', '2025-05-12 10:56:33.594305+00', 'New York Office - Break Room', 'Jane Smith', 'Medium', 'Resolved', 'Slip and Fall', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-27 10:56:33.594305+00', '2025-05-27 10:56:33.594305+00'),
	('c1ce65dd-40fc-46ae-b821-d51f88a6408a', 'Office Slip', 'Employee slipped on wet floor in break room', '2025-05-12 16:33:21.726881+00', 'New York Office - Break Room', 'Jane Smith', 'Medium', 'Resolved', 'Slip and Fall', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-27 16:33:21.726881+00', '2025-05-27 16:33:21.726881+00'),
	('f257bb6a-ec58-4c45-9fd4-3620d76a467e', 'Office Slip', 'Employee slipped on wet floor in break room', '2025-05-12 17:17:26.25866+00', 'New York Office - Break Room', 'Jane Smith', 'Medium', 'Resolved', 'Slip and Fall', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-27 17:17:26.25866+00', '2025-05-27 17:17:26.25866+00');


--
-- Data for Name: workflows; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: workflow_instances; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 128, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
