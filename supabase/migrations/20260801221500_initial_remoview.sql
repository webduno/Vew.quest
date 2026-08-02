-- Vew.quest initial schema for cojoined DB
-- All tables use the remoview_ prefix to avoid collisions with other apps.

-- ---------------------------------------------------------------------------
-- remoview_crv_object  (was: crv_object)
-- CRV viewing results / scores
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remoview_crv_object (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  result double precision NOT NULL DEFAULT 0,
  storage_key text NOT NULL,
  request_id uuid NULL,
  party_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS remoview_crv_object_storage_key_idx
  ON public.remoview_crv_object (storage_key);

CREATE INDEX IF NOT EXISTS remoview_crv_object_request_id_idx
  ON public.remoview_crv_object (request_id);

CREATE INDEX IF NOT EXISTS remoview_crv_object_party_id_idx
  ON public.remoview_crv_object (party_id);

CREATE INDEX IF NOT EXISTS remoview_crv_object_created_at_idx
  ON public.remoview_crv_object (created_at DESC);

-- ---------------------------------------------------------------------------
-- remoview_crv_request  (was: crv_request)
-- Public CRV request board / mailbox
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remoview_crv_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  creator_id text NOT NULL,
  solved integer NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0,
  bounty numeric NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS remoview_crv_request_creator_id_idx
  ON public.remoview_crv_request (creator_id);

CREATE INDEX IF NOT EXISTS remoview_crv_request_board_idx
  ON public.remoview_crv_request (solved, attempts, created_at DESC);

-- Optional FK from viewing results → requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'remoview_crv_object_request_id_fkey'
  ) THEN
    ALTER TABLE public.remoview_crv_object
      ADD CONSTRAINT remoview_crv_object_request_id_fkey
      FOREIGN KEY (request_id)
      REFERENCES public.remoview_crv_request (id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- remoview_vew_click  (was: vew_click)
-- Clicker / economy per player
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remoview_vew_click (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL,
  win integer NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0,
  spent text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS remoview_vew_click_player_id_uidx
  ON public.remoview_vew_click (player_id);

-- ---------------------------------------------------------------------------
-- remoview_vew_party  (was: vew_party)
-- Multiplayer / friend rooms
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remoview_vew_party (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_key text NOT NULL,
  target_code text NULL,
  live_data text NULL,
  chat text NOT NULL DEFAULT '',
  turn text NULL,
  friend1 text NULL,
  friend2 text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS remoview_vew_party_room_key_idx
  ON public.remoview_vew_party (room_key);

CREATE INDEX IF NOT EXISTS remoview_vew_party_created_at_idx
  ON public.remoview_vew_party (created_at DESC);

-- ---------------------------------------------------------------------------
-- remoview_vew_lesson  (was: vew_lesson)
-- Learn-tool lessons
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remoview_vew_lesson (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  title text NULL,
  content text NULL,
  creator_id text NOT NULL,
  progress text NULL,
  proxy_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS remoview_vew_lesson_creator_id_idx
  ON public.remoview_vew_lesson (creator_id);

CREATE INDEX IF NOT EXISTS remoview_vew_lesson_lesson_id_idx
  ON public.remoview_vew_lesson (lesson_id);

CREATE UNIQUE INDEX IF NOT EXISTS remoview_vew_lesson_creator_lesson_uidx
  ON public.remoview_vew_lesson (creator_id, lesson_id);

CREATE INDEX IF NOT EXISTS remoview_vew_lesson_proxy_id_idx
  ON public.remoview_vew_lesson (proxy_id);

-- ---------------------------------------------------------------------------
-- remoview_dev_issue  (was: dev_issue)
-- Feedback / bug reports
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remoview_dev_issue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  player_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS remoview_dev_issue_player_id_idx
  ON public.remoview_dev_issue (player_id);

CREATE INDEX IF NOT EXISTS remoview_dev_issue_created_at_idx
  ON public.remoview_dev_issue (created_at DESC);
