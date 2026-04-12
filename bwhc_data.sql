--
-- PostgreSQL database dump
--

\restrict 9CsMK1Glx2DuulDtIB1xMTdCtTo2kM2sVp5QiTne5YoCEMuzKfR3ZDvLSJlYOz8

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

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
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--

INSERT INTO public._prisma_migrations VALUES ('6fc30fe6-9256-47b3-9178-c9c1c3fa1a49', '12a75cfd8686abcb310d006bd5250e86e52c628141d7feca39317be9cf34cdef', '2026-04-03 17:51:44.476208+00', '20260329183811_phase2_backend', NULL, NULL, '2026-04-03 17:51:44.310023+00', 1);
INSERT INTO public._prisma_migrations VALUES ('c208b306-55e5-434a-af11-a9779eeaf687', '93147675ab49c00b2e1c5ef4fa3591906dcb249575f5eb6027ce5f7f896b4b31', '2026-04-05 15:11:12.384954+00', '20260405120000_multi_platform_videos', NULL, NULL, '2026-04-05 15:11:12.323188+00', 1);
INSERT INTO public._prisma_migrations VALUES ('f079d1ae-d8be-457b-bf44-0bc3c3e5a828', '93147675ab49c00b2e1c5ef4fa3591906dcb249575f5eb6027ce5f7f896b4b31', NULL, '20260405120000_video_sources', 'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve

Migration name: 20260405120000_video_sources

Database error code: 42P07

Database error:
ERROR: relation "video_sources" already exists

DbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42P07), message: "relation \"video_sources\" already exists", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("heap.c"), line: Some(1150), routine: Some("heap_create_with_catalog") }

   0: sql_schema_connector::apply_migration::apply_script
           with migration_name="20260405120000_video_sources"
             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113
   1: schema_commands::commands::apply_migrations::Applying migration
           with migration_name="20260405120000_video_sources"
             at schema-engine/commands/src/commands/apply_migrations.rs:95
   2: schema_core::state::ApplyMigrations
             at schema-engine/core/src/state.rs:260', NULL, '2026-04-12 09:53:52.708265+00', 0);


--
-- Data for Name: playlists; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--

INSERT INTO public.playlists VALUES ('13912038-d8e8-4503-abbd-2601f0bfc737', 'Mindfulness', 'mindfulness', 'Mindfulness is the practice of intentionally focusing on the present moment—thoughts, emotions, and surroundings—with acceptance and without judgment. It reduces stress, improves mental health, and boosts emotional regulation by breaking cycles of anxiety and automatic reactions. Key techniques include mindful breathing, sensory awareness, and body scans.', '/uploads/playlists/1775584251428-wwydcrmck5.jpg', 'SERIES', 4, true, '2026-04-07 17:50:54.494', '2026-04-07 17:50:54.494');
INSERT INTO public.playlists VALUES ('92f1ca6d-67b5-487f-bc5b-98e74e0f63fc', 'Creative & Inspiring', 'creative-inspiring', 'Welcome to my art printing journey! Watch as I transform designs into physical pieces of art, sharing the techniques and magic behind every print.', NULL, 'PLAYLIST', 3, true, '2026-04-05 16:18:56.288', '2026-04-05 16:41:06.291');
INSERT INTO public.playlists VALUES ('6d259bc7-b415-4e11-b23a-06be12942565', 'حاجات مكنتش متخيلة أكون ممتنة ليها', '-', 'حاجات مكنتش متخيلة أكون ممتنة ليها', '/uploads/playlists/1775414417075-q27nws5nxrg.jpg', 'SERIES', 1, true, '2026-04-03 18:10:27.643', '2026-04-05 18:50:23.293');
INSERT INTO public.playlists VALUES ('fd287bed-58ba-4592-a2da-ccc097c33571', 'Cognitive Distortions', 'cognitive-distortions', 'التشوّهات المعرفية دي عبارة عن أفكار مش منطقية أو مبالغ فيها بتخلينا نشوف الواقع بشكل غلط، وده بيزود عندنا القلق والمشاعر الوحشة. هي بتبقى عاملة زي "فلتر" في دماغنا بيغير طريقة فهمنا للأحداث، وبيخلينا نتخيل إن الدنيا أسوأ بكتير من حقيقتها.
Cognitive distortions are irrational or exaggerated thought patterns that can cause people to perceive reality inaccurately, often contributing to increased anxiety and negative emotions. They act as "mental filters" that twist the way we interpret events, leading us to believe things are much worse than they actually are.', NULL, 'PLAYLIST', 2, true, '2026-04-05 14:03:26.874', '2026-04-05 18:56:10.453');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--



--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--

INSERT INTO public.videos VALUES ('86209877-a361-4c05-8655-1b1bf392b19d', 'الحلقة الأولى: يعني إيه "مايند فولنس"؟ m', '-m', 'سلسة ال Mindfulness الحلقة الأولى: يعني إيه "مايند فولنس"؟ 🧠✨
الـ Mindfulness هي "الحُضور" 🧘‍♀️

إنك تكون موجود بعقلك وحواسك
في المكان اللي جسمك موجود فيه دلوقتي..

وتعيش اللحظة الحالية زي ما هي،
من غير ما عقلك "يتسحل" في:
الماضي (اللي خلص) ✖️
أو قلق المستقبل (اللي لسه مجاش) ✖️

Episode 1: What is Mindfulness?🧠✨
Mindfulness is "Presence" 🧘‍♀️
It’s being mentally and physically present
in the exact place where you are Right Now..

Experiencing the current moment as it is,
without letting your mind get lost in:
The Past (which is over) ✖️
or Future Anxiety (which hasn''t happened) ✖️', NULL, NULL, '13912038-d8e8-4503-abbd-2601f0bfc737', 1, '{#Balance_wz_Haidy,#Mindfulness,#here_and_now,#Anxiety,#present}', 0, true, '2026-04-07 17:53:45.271', '2026-04-07 17:53:45.271');
INSERT INTO public.videos VALUES ('a4f11826-33e4-4ba2-9401-e1d326962b5b', 'كام مرة شربت قهوتك وأنت مركز في طعمها بجد؟ mh', '-mh', 'كام مرة شربت قهوتك وأنت مركز في طعمها بجد؟☕️✨

الميند فولنس بيساعدك إنك " تاخد" أفكارك.. لـ هنا ودلوقتي،
بإنك تستخدم حواسك أكتر وتستمتع بتفاصيل بسيطة.. 🌿
زي رشفة قهوة بتركيز.

قولولي في الكومنتات:إيه أكتر حاجة بتسرق منك "هنا ودلوقتي"؟ 🧠💭

---

How often do you actually taste your coffee?☕️✨

Mindfulness helps you "bring"your thoughts back.. to here and now
by engaging your senses and enjoying the simple details.. 🌿
like a mindful sip of coffee.

Tell me in the comments:What distracts you the most from the "here and now"?', NULL, NULL, '13912038-d8e8-4503-abbd-2601f0bfc737', 2, '{#Balance_wz_Haidy,#Mindfulness,#here_and_now}', 0, true, '2026-04-07 17:57:20.754', '2026-04-07 17:57:20.754');
INSERT INTO public.videos VALUES ('cf3017b8-ad9a-4c6b-9ada-e4d80232a9f7', 'Happy Valentine’s Day ❤️', 'happy-valentines-day-', 'Happy Valentine’s Day ❤️
عيدتوا علي الاشخاص اللي بتحبوهم …..', NULL, NULL, '92f1ca6d-67b5-487f-bc5b-98e74e0f63fc', 2, '{#valentinesday}', 0, true, '2026-04-07 18:01:38.076', '2026-04-07 18:01:38.076');
INSERT INTO public.videos VALUES ('5ee35355-289f-4094-8de1-484661c46096', 'الحلقة التانية من سلسلة "حاجات مكنتش متخيلة أكون ممتنة ليها" مش كل خسارة خسارة', '-k', 'الحلقة التانية من سلسلة
"حاجات مكنتش متخيلة أكون ممتنة ليها"
مش كل خسارة خسارة.
في علاقات بنفتكر إن نهايتها كسر،
لكنها في الحقيقة… هي نضج 🌱
العلاقات جزء أساسي من حياتنا،
بس الوعي الحقيقي
إننا نختار مين يدخل دوايرنا القريبة،
ومين مكانه يبقى أبعد علشان سلامنا النفسي. 🤍

Episode Two of the series
“Things I never imagined I’d be grateful for”

Not every loss is truly a loss.
Some relationships feel like a break,
but in truth… they are growth. 🌱
Relationships are an essential part of our lives,
but real awareness means choosing
who gets close to our inner circles,
and who needs distance for the sake of our peace. 🤍', 'https://placehold.co/1280x720/E8DCC8/5A5047?text=TikTok+Video+7599035199510383894', NULL, '6d259bc7-b415-4e11-b23a-06be12942565', 2, '{}', 0, true, '2026-04-03 18:30:36.594', '2026-04-05 14:27:53.969');
INSERT INTO public.videos VALUES ('e5b7c6fa-43f6-44e4-b50d-a5a9de738dd5', 'مش كل صفة بتقولها عن نفسك تبقى حقيقة 🔖', '-d', 'مش كل صفة بتقولها عن نفسك تبقى حقيقة 🔖
🎥 حلقة ٢ : أنماط التفكير الخاطئة
⸻
Not every label you give yourself is true 🔖
🎥 Episode 2: Cognitive Distortions', NULL, NULL, 'fd287bed-58ba-4592-a2da-ccc097c33571', 2, '{#mindset,#mentalhealth,#balance_wz_Haidy,#balance,#Self_awareness,#personal_growth,#thoughtpatterns}', 0, true, '2026-04-05 16:58:07.649', '2026-04-05 16:58:32.795');
INSERT INTO public.videos VALUES ('f9f515fb-b8a0-49b4-a32a-caca70d04892', 'مش كل حاجة يا أبيض يا أسود !! ⚫⚪🤯', '-h', 'مش كل حاجة يا أبيض يا أسود !! ⚫⚪🤯
Not everything is just black or white!! ⚫⚪🤯
.
.
.
.
🎥 حلقة ١: أنماط التفكير الخاطئة

⸻
🎥 Episode 1: Cognitive Distortions

#mindset
#mentalhealth
#balance_wz_Haidy
#balance
#Self_awareness', NULL, NULL, 'fd287bed-58ba-4592-a2da-ccc097c33571', 1, '{}', 0, true, '2026-04-05 14:38:11.999', '2026-04-05 15:31:17.457');
INSERT INTO public.videos VALUES ('fc7c0d1b-ca84-4f0b-8428-9b0a84d2ef71', '*الحلقة الأولى* من سلسلة حاجات مكنتش متخيلة أكون ممتنة ليها مش سهل نكون ممتنين للحاجات الصعبة 🤍', '-', 'مش سهل نكون ممتنين للحاجات الصعبة…
بس يمكن فيها معنى ما شفنهوش قبل كده.
تعالوا معايا في *الحلقة الأولى* من سلسلة:
حاجات مكنتش متخيلة أكون ممتنة ليها 🤍

It’s not easy to be grateful for the hard things…
but maybe they carry a meaning we couldn’t see before.
Join me in the *first episode* of the series:
Things I never imagined I’d be grateful for 🤍

#Balance_Wz_Haidy
#Gratitude
#My_Journey
#Self_Awareness', 'https://placehold.co/1280x720/E8DCC8/5A5047?text=TikTok+Video+7591969484483693846', NULL, '6d259bc7-b415-4e11-b23a-06be12942565', 1, '{#Gratitude,#My_Journey,#Self_Awareness}', 0, true, '2026-04-03 18:11:50.61', '2026-04-05 14:36:32.275');
INSERT INTO public.videos VALUES ('ef851200-8189-470d-9084-00d5793839ff', 'الرسم هو المساحة اللي بيفصل فيها عقلي من كل حاجه', '-f', 'بالنسبة لي، الرسم هو المساحة اللي بيفصل فيها عقلي من كل حاجه وبيخليني قادرة أكون موجودة في اللحظة دي.. هنا ودلوقتي ✨️
​مهم جداً نكون عارفين "أدواتنا الخاصة" اللي بتساعدنا نجدد طاقتنا ونرجع للتوازن بتاعنا، علشان نقدر نكمل....
​شاركوني... أيه النشاط أو الحاجة البسيطة اللي بتعملوها في الإجازة وبتحسوا إنها بتشحن طاقتكم فعلاً؟ 🌿
​For me, painting is the space where my mind disconnects from everything and allows me to truly be present in the moment.. here and now ✨️
​It is essential to know our "personal tools" that help us recharge and restore our balance, so we can keep going....
​Share with me... What is that simple activity you do during the weekend that truly makes you feel recharged? 🌿', NULL, NULL, '92f1ca6d-67b5-487f-bc5b-98e74e0f63fc', 1, '{​#Balance_wz_Haidy,#mindfulness,#art_therapy}', 0, true, '2026-04-05 16:21:14.388', '2026-04-05 16:21:30.342');
INSERT INTO public.videos VALUES ('7952bcc2-9a65-4e29-b67e-09a564f20f51', 'مفيش داعي تحمّل نفسك كل حاجة بتحصل وتلوم نفسك', '-g', '"مفيش داعي تحمّل نفسك كل حاجة بتحصل وتلوم نفسك… انت مش المسؤول 🔖
🎥 حلقة ٣ : أنماط التفكير الخاطئة
⸻
No need to blame yourself for everything that happens… You’re not responsible 🔖
🎥 Episode 3: Cognitive Distortions', NULL, NULL, 'fd287bed-58ba-4592-a2da-ccc097c33571', 3, '{#mindset,#mentalhealth,#balance_wz_Haidy,#balance,#Self_awareness,#personal_growth,#thoughtpatterns}', 0, true, '2026-04-05 16:45:36.025', '2026-04-05 16:45:52.261');


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--



--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--



--
-- Data for Name: video_sources; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--

INSERT INTO public.video_sources VALUES ('245b7a57-8938-4367-b074-dedb5a3bef16', '5ee35355-289f-4094-8de1-484661c46096', 'TIKTOK', 'https://www.tiktok.com/@balance_wz_haidy/video/7599035199510383894?is_from_webapp=1&sender_device=pc&web_id=7624595862278178305', '7599035199510383894', true, '2026-04-03 18:30:36.594', '2026-04-05 14:27:53.969');
INSERT INTO public.video_sources VALUES ('b1fc175d-2f6d-4f05-a5ce-2a02cc9bd5c6', 'fc7c0d1b-ca84-4f0b-8428-9b0a84d2ef71', 'TIKTOK', 'https://www.tiktok.com/@balance_wz_haidy/video/7591969484483693846?is_from_webapp=1&sender_device=pc&web_id=7624595862278178305', '7591969484483693846', true, '2026-04-03 18:11:50.61', '2026-04-05 14:36:32.275');
INSERT INTO public.video_sources VALUES ('a6320e2d-f709-47c2-a821-ca815d063903', 'f9f515fb-b8a0-49b4-a32a-caca70d04892', 'TIKTOK', 'https://www.tiktok.com/@balance_wz_haidy/video/7555555022419873046', '7555555022419873046', true, '2026-04-05 15:31:17.482', '2026-04-05 15:31:17.482');
INSERT INTO public.video_sources VALUES ('26b30636-db7f-4536-bf79-c9db7ab81046', 'f9f515fb-b8a0-49b4-a32a-caca70d04892', 'FACEBOOK', 'https://www.facebook.com/100064718392883/videos/1846224206331402/?app=fbl', '1846224206331402', false, '2026-04-05 15:31:17.482', '2026-04-05 15:31:17.482');
INSERT INTO public.video_sources VALUES ('13ba3952-00ca-4f1e-9229-9571f0f0df2f', 'f9f515fb-b8a0-49b4-a32a-caca70d04892', 'INSTAGRAM', 'https://www.instagram.com/reel/DOohJ9ADeso/?igsh=b3k3c3JxaGk5bzMw', 'DOohJ9ADeso', false, '2026-04-05 15:31:17.482', '2026-04-05 15:31:17.482');
INSERT INTO public.video_sources VALUES ('0bec9917-7918-46cc-9813-0b711d4aff14', 'ef851200-8189-470d-9084-00d5793839ff', 'FACEBOOK', 'https://www.facebook.com/reel/914921724756332/?app=fbl', '914921724756332', true, '2026-04-05 16:21:30.362', '2026-04-05 16:21:30.362');
INSERT INTO public.video_sources VALUES ('58e3d845-7b53-419a-954b-a7c26b692a03', '7952bcc2-9a65-4e29-b67e-09a564f20f51', 'FACEBOOK', 'https://www.facebook.com/reel/1522287322359674/?app=fbl', '1522287322359674', true, '2026-04-05 16:45:52.278', '2026-04-05 16:45:52.278');
INSERT INTO public.video_sources VALUES ('76e8b4ce-9d19-4b77-bbbd-983db789fd82', 'e5b7c6fa-43f6-44e4-b50d-a5a9de738dd5', 'FACEBOOK', 'https://www.facebook.com/reel/1812415436048747/?app=fbl', '1812415436048747', true, '2026-04-05 16:58:32.87', '2026-04-05 16:58:32.87');
INSERT INTO public.video_sources VALUES ('8c4f11e4-bc64-4a42-b000-00a1519257cc', '86209877-a361-4c05-8655-1b1bf392b19d', 'TIKTOK', 'https://www.tiktok.com/@balance_wz_haidy/video/7623125436809088278', '7623125436809088278', true, '2026-04-07 17:53:45.271', '2026-04-07 17:53:45.271');
INSERT INTO public.video_sources VALUES ('dbb648de-3b0b-4e6f-a793-9b8efcd265c6', 'a4f11826-33e4-4ba2-9401-e1d326962b5b', 'TIKTOK', 'https://www.tiktok.com/@balance_wz_haidy/video/7625723025790438678', '7625723025790438678', true, '2026-04-07 17:57:20.754', '2026-04-07 17:57:20.754');
INSERT INTO public.video_sources VALUES ('2d259937-9065-4b3f-96cf-cd7fdcd6c537', 'cf3017b8-ad9a-4c6b-9ada-e4d80232a9f7', 'TIKTOK', 'https://www.tiktok.com/@balance_wz_haidy/photo/7606762693055237398', NULL, true, '2026-04-07 18:01:38.076', '2026-04-07 18:01:38.076');


--
-- Data for Name: viewing_history; Type: TABLE DATA; Schema: public; Owner: bwhc_user
--



--
-- PostgreSQL database dump complete
--

\unrestrict 9CsMK1Glx2DuulDtIB1xMTdCtTo2kM2sVp5QiTne5YoCEMuzKfR3ZDvLSJlYOz8

