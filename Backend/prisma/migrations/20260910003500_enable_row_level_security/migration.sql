-- Enable Row-Level Security (RLS) on all public tables to enforce deny-by-default access control
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_favorites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "saved_comparisons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "price_alerts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "news_articles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "brands" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "car_models" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "generations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "model_years" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "market_variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "engine_specs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "dimension_specs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "performance_specs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fuel_economy_specs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "safety_specs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "features_equipment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "variant_prices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "data_sources" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "data_conflicts" ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1. PUBLIC READ-ONLY CATALOG & NEWS POLICIES (SELECT open, INSERT/UPDATE/DELETE restricted to service role/admin)
-- -----------------------------------------------------------------------------
CREATE POLICY "Public read catalog brands" ON "brands" FOR SELECT USING (true);
CREATE POLICY "Public read catalog car models" ON "car_models" FOR SELECT USING (true);
CREATE POLICY "Public read catalog generations" ON "generations" FOR SELECT USING (true);
CREATE POLICY "Public read catalog model years" ON "model_years" FOR SELECT USING (true);
CREATE POLICY "Public read catalog market variants" ON "market_variants" FOR SELECT USING (true);
CREATE POLICY "Public read engine specs" ON "engine_specs" FOR SELECT USING (true);
CREATE POLICY "Public read dimension specs" ON "dimension_specs" FOR SELECT USING (true);
CREATE POLICY "Public read performance specs" ON "performance_specs" FOR SELECT USING (true);
CREATE POLICY "Public read fuel economy specs" ON "fuel_economy_specs" FOR SELECT USING (true);
CREATE POLICY "Public read safety specs" ON "safety_specs" FOR SELECT USING (true);
CREATE POLICY "Public read features equipment" ON "features_equipment" FOR SELECT USING (true);
CREATE POLICY "Public read variant prices" ON "variant_prices" FOR SELECT USING (true);
CREATE POLICY "Public read published news articles" ON "news_articles" FOR SELECT USING (status = 'PUBLISHED');

-- -----------------------------------------------------------------------------
-- 2. USER OWNERSHIP POLICIES (Users can only access & mutate their own records)
-- -----------------------------------------------------------------------------

-- Users table: Users can view and update their own profile
CREATE POLICY "Users can view own record" ON "users"
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own record" ON "users"
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User Favorites: Scope SELECT, INSERT, UPDATE, DELETE to record owner
CREATE POLICY "User favorites select policy" ON "user_favorites"
    FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "User favorites insert policy" ON "user_favorites"
    FOR INSERT WITH CHECK (auth.uid() = "userId");

CREATE POLICY "User favorites update policy" ON "user_favorites"
    FOR UPDATE USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");

CREATE POLICY "User favorites delete policy" ON "user_favorites"
    FOR DELETE USING (auth.uid() = "userId");

-- Saved Comparisons: Scope SELECT, INSERT, UPDATE, DELETE to record owner
CREATE POLICY "Saved comparisons select policy" ON "saved_comparisons"
    FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "Saved comparisons insert policy" ON "saved_comparisons"
    FOR INSERT WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Saved comparisons update policy" ON "saved_comparisons"
    FOR UPDATE USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Saved comparisons delete policy" ON "saved_comparisons"
    FOR DELETE USING (auth.uid() = "userId");

-- Price Alerts: Scope SELECT, INSERT, UPDATE, DELETE to record owner
CREATE POLICY "Price alerts select policy" ON "price_alerts"
    FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "Price alerts insert policy" ON "price_alerts"
    FOR INSERT WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Price alerts update policy" ON "price_alerts"
    FOR UPDATE USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Price alerts delete policy" ON "price_alerts"
    FOR DELETE USING (auth.uid() = "userId");
