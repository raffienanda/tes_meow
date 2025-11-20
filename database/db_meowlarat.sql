--
-- PostgreSQL database dump
--

\restrict JB4bMjrCjcMq90V2fdhGya3fupXEafhK8JnUakelKL1FCQY7oaYYDgD4mLqVbbj

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: artikel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artikel (
    id integer NOT NULL,
    img_url character varying(255) NOT NULL,
    nama character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    teks text NOT NULL
);


ALTER TABLE public.artikel OWNER TO postgres;

--
-- Name: artikel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.artikel ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.artikel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cat (
    id integer NOT NULL,
    img_url character varying(255) NOT NULL,
    nama character varying(255) NOT NULL,
    age character varying(255) NOT NULL,
    gender character varying(10) NOT NULL,
    ras character varying(255) NOT NULL,
    karakteristik text NOT NULL,
    isvaccinated character varying(50) NOT NULL,
    isadopted character varying(50),
    adopter character varying(255)
);


ALTER TABLE public.cat OWNER TO postgres;

--
-- Name: cat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cat ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: donasi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donasi (
    id integer NOT NULL,
    nominal integer NOT NULL,
    pesan text NOT NULL,
    metode integer NOT NULL,
    username character varying(255) NOT NULL
);


ALTER TABLE public.donasi OWNER TO postgres;

--
-- Name: donasi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.donasi ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.donasi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: laporan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.laporan (
    id integer NOT NULL,
    category character varying(255) NOT NULL,
    lokasi character varying(255) NOT NULL,
    deskripsi text NOT NULL,
    img_url character varying(255) NOT NULL,
    notes text NOT NULL
);


ALTER TABLE public.laporan OWNER TO postgres;

--
-- Name: laporan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.laporan ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.laporan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: metode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metode (
    id integer NOT NULL,
    nama character varying(255) NOT NULL
);


ALTER TABLE public.metode OWNER TO postgres;

--
-- Name: metode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.metode ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.metode_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: petplace; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.petplace (
    id integer NOT NULL,
    nama character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    img_url character varying(255) NOT NULL
);


ALTER TABLE public.petplace OWNER TO postgres;

--
-- Name: petplace_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.petplace ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.petplace_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    teks text NOT NULL,
    id_thread integer NOT NULL,
    username character varying(255) NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.posts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shelter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shelter (
    id integer NOT NULL,
    nama character varying(255) NOT NULL,
    lokasi character varying(255) NOT NULL
);


ALTER TABLE public.shelter OWNER TO postgres;

--
-- Name: shelter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.shelter ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shelter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tanggungjawab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tanggungjawab (
    id integer NOT NULL,
    id_cat integer NOT NULL,
    gambarmakanan1 character varying(255),
    gambarmakanan2 character varying(255),
    gambarmakanan3 character varying(255),
    gambaraktivitas1 character varying(255),
    gambaraktivitas2 character varying(255),
    gambaraktivitas3 character varying(255),
    gambarkotoran1 character varying(255),
    gambarkotoran2 character varying(255),
    gambarkotoran3 character varying(255)
);


ALTER TABLE public.tanggungjawab OWNER TO postgres;

--
-- Name: tanggungjawab_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tanggungjawab ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tanggungjawab_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: threads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.threads (
    id integer NOT NULL,
    nama character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    teks text NOT NULL,
    username character varying(255) NOT NULL
);


ALTER TABLE public.threads OWNER TO postgres;

--
-- Name: threads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.threads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tokoonline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokoonline (
    id integer NOT NULL,
    deskripsi text NOT NULL,
    notes text NOT NULL
);


ALTER TABLE public.tokoonline OWNER TO postgres;

--
-- Name: tokoonline_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tokoonline ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tokoonline_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    nama character varying(255) NOT NULL,
    phone character varying(15) NOT NULL,
    password character varying(255) NOT NULL,
    bio character varying(255) NOT NULL,
    img_url character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: artikel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artikel (id, img_url, nama, category, teks) FROM stdin;
1	https://picsum.photos/seed/art1/800/400	Cara Merawat Anak Kucing	Perawatan	Isi panduan singkat merawat anak kucing...
2	https://picsum.photos/seed/art2/800/400	Makanan Sehat untuk Kucing	Makanan	Daftar makanan yang aman untuk kucing...
\.


--
-- Data for Name: cat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cat (id, img_url, nama, age, gender, ras, karakteristik, isvaccinated, isadopted, adopter) FROM stdin;
1	https://placekitten.com/300/300	 Milo	 2 tahun	 Male	 Domestic	 suka tidur dan dielus	 sudah	 belum	\N
2	https://placekitten.com/301/300	 Luna	 1 tahun	 Female	 Anggora	 suka main bola	 sudah	 belum	\N
3	https://placekitten.com/302/300	 Simba	 3 tahun	 Male	 Persia	 Tenang	 sudah	 belum	\N
4	https://placekitten.com/303/300	 Nala	 4 bulan	 Female	 Domestic	 Protektif	 false	 belum	\N
\.


--
-- Data for Name: donasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.donasi (id, nominal, pesan, metode, username) FROM stdin;
1	50000	Donasi untuk perawatan kucing jalanan	1	catlover1
2	100000	Untuk biaya steril dan vaksin	2	catlover2
\.


--
-- Data for Name: laporan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.laporan (id, category, lokasi, deskripsi, img_url, notes) FROM stdin;
\.


--
-- Data for Name: metode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metode (id, nama) FROM stdin;
1	BCA
2	BRI
3	BNI
4	Mandiri
5	CIMB Niaga
6	Permata
7	BSI
8	Dana
9	OVO
10	GoPay
11	ShopeePay
\.


--
-- Data for Name: petplace; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.petplace (id, nama, category, img_url) FROM stdin;
1	PetCare Clinic	Klinik	https://picsum.photos/seed/clinic/600/400
2	Happy Pets Store	Toko Hewan	https://picsum.photos/seed/shop/600/400
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, teks, id_thread, username) FROM stdin;
1	Sebaiknya tidak, banyak kucing intoleran laktosa.	1	catlover2
2	Pakai sikat halus dan gunting kuku hati-hati.	2	admin
3	Saya adopsi lewat shelter lokal; prosesnya cepat.	3	catlover1
\.


--
-- Data for Name: shelter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shelter (id, nama, lokasi) FROM stdin;
1	Meow Home Shelter	Jl. Kucing No.12, Bandung
2	Paws Rescue Center	Jl. Penyelamat No.7, Jakarta
\.


--
-- Data for Name: tanggungjawab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tanggungjawab (id, id_cat, gambarmakanan1, gambarmakanan2, gambarmakanan3, gambaraktivitas1, gambaraktivitas2, gambaraktivitas3, gambarkotoran1, gambarkotoran2, gambarkotoran3) FROM stdin;
1	1	https://picsum.photos/id/101/400/300	https://picsum.photos/id/102/400/300	https://picsum.photos/id/103/400/300	https://picsum.photos/id/201/400/300	https://picsum.photos/id/202/400/300	https://picsum.photos/id/203/400/300	https://picsum.photos/id/301/400/300	https://picsum.photos/id/302/400/300	https://picsum.photos/id/303/400/300
2	2	https://placekitten.com/400/300	https://placekitten.com/401/300	https://placekitten.com/402/300	https://placekitten.com/403/300	https://placekitten.com/404/300	https://placekitten.com/405/300	https://placekitten.com/406/300	https://placekitten.com/407/300	https://placekitten.com/408/300
3	3	https://picsum.photos/id/110/400/300	https://picsum.photos/id/111/400/300	https://picsum.photos/id/112/400/300	https://picsum.photos/id/210/400/300	https://picsum.photos/id/211/400/300	https://picsum.photos/id/212/400/300	https://picsum.photos/id/310/400/300	https://picsum.photos/id/311/400/300	https://picsum.photos/id/312/400/300
\.


--
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.threads (id, nama, category, teks, username) FROM stdin;
1	Bolehkah kucing minum susu sapi?	Kesehatan	Apakah aman memberi susu sapi ke kucing?	catlover1
2	Cara grooming kucing di rumah	Perawatan	Ada tips grooming murah dan efektif?	catlover2
3	Adopsi kucing: pengalaman	Adopsi	Ceritakan pengalaman adopsi kamu.	admin
\.


--
-- Data for Name: tokoonline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokoonline (id, deskripsi, notes) FROM stdin;
1	Toko perlengkapan kucing online, jual makanan dan aksesoris.	Buka 09:00-18:00
2	Marketplace barang hewan, pengiriman ke seluruh Indonesia.	Promo bebas ongkir
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, email, nama, phone, password, bio, img_url) FROM stdin;
catlover1	lover1@mail.com	Reza Pratama	081234567890	hashedpass1	Pecinta kucing lokal	https://i.pravatar.cc/150?img=1
catlover2	lover2@mail.com	Annisa Putri	082345678901	hashedpass2	Suka rescue kucing jalanan	https://i.pravatar.cc/150?img=2
admin	admin@meow.com	Admin Meow	081298765432	hashedpass3	Administrator aplikasi	https://i.pravatar.cc/150?img=3
pengguna_baru	kucing@contoh.com	Pencinta Kucing	081234567890	$2b$10$5tU8AjD7.LoWY2ymVPwmbetpfemWPlpMY9RWZRGZzgMUNAHuLxjLK	Saya suka memelihara kucing oren	default.png
raffienanda	raffienanda@gmail.com	Raffie Arsy Ananda	0816604884	$2b$10$BQUL3HtALdwZSZ3WajHrf.rxiEZLOstY3xWOxDZjyICyU1hM5Ouq6	i love meng	default.png
\.


--
-- Name: artikel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.artikel_id_seq', 1, false);


--
-- Name: cat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cat_id_seq', 1, false);


--
-- Name: donasi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.donasi_id_seq', 1, false);


--
-- Name: laporan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.laporan_id_seq', 1, false);


--
-- Name: metode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metode_id_seq', 1, false);


--
-- Name: petplace_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.petplace_id_seq', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- Name: shelter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shelter_id_seq', 1, false);


--
-- Name: tanggungjawab_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tanggungjawab_id_seq', 1, false);


--
-- Name: threads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.threads_id_seq', 1, false);


--
-- Name: tokoonline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokoonline_id_seq', 1, false);


--
-- Name: artikel artikel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artikel
    ADD CONSTRAINT artikel_pkey PRIMARY KEY (id);


--
-- Name: cat cat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat
    ADD CONSTRAINT cat_pkey PRIMARY KEY (id);


--
-- Name: donasi donasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donasi
    ADD CONSTRAINT donasi_pkey PRIMARY KEY (id);


--
-- Name: laporan laporan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laporan
    ADD CONSTRAINT laporan_pkey PRIMARY KEY (id);


--
-- Name: metode metode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metode
    ADD CONSTRAINT metode_pkey PRIMARY KEY (id);


--
-- Name: petplace petplace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petplace
    ADD CONSTRAINT petplace_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: shelter shelter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelter
    ADD CONSTRAINT shelter_pkey PRIMARY KEY (id);


--
-- Name: tanggungjawab tanggungjawab_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanggungjawab
    ADD CONSTRAINT tanggungjawab_pkey PRIMARY KEY (id);


--
-- Name: threads threads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT threads_pkey PRIMARY KEY (id);


--
-- Name: tokoonline tokoonline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokoonline
    ADD CONSTRAINT tokoonline_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: cat cat_adopter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat
    ADD CONSTRAINT cat_adopter_fkey FOREIGN KEY (adopter) REFERENCES public.users(username);


--
-- Name: donasi donasi_metode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donasi
    ADD CONSTRAINT donasi_metode_fkey FOREIGN KEY (metode) REFERENCES public.metode(id);


--
-- Name: donasi donasi_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donasi
    ADD CONSTRAINT donasi_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- Name: posts posts_id_thread_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_id_thread_fkey FOREIGN KEY (id_thread) REFERENCES public.threads(id);


--
-- Name: posts posts_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- Name: tanggungjawab tanggungjawab_id_cat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanggungjawab
    ADD CONSTRAINT tanggungjawab_id_cat_fkey FOREIGN KEY (id_cat) REFERENCES public.cat(id);


--
-- Name: threads threads_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT threads_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- PostgreSQL database dump complete
--

\unrestrict JB4bMjrCjcMq90V2fdhGya3fupXEafhK8JnUakelKL1FCQY7oaYYDgD4mLqVbbj

