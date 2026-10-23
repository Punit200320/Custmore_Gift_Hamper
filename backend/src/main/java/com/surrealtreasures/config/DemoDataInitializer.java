package com.surrealtreasures.config;

import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Demo Data Initializer for Surreal Treasures.
 * Seeds initial verified and test catalogue items if the database is empty.
 * Clearly labeled as demo data per requirements.
 */
@Component
public class DemoDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataInitializer.class);
    private final ProductRepository productRepository;

    public DemoDataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("Product catalogue already populated with {} items. Skipping demo seeding.", productRepository.count());
            return;
        }

        log.info("Seeding initial demo product catalogue. NOTE: Demo catalogue data for evaluation; laboratory verification required in production.");

        List<Product> demoProducts = Arrays.asList(
                new Product(
                        "prod_soap_lavender",
                        "Lavender & Roman Chamomile Artisan Soap",
                        "Cold-process handmade soap cured for 6 weeks with pure botanical extracts. Gentle relaxation ritual. [DEMO DATA]",
                        "Artisan Soaps",
                        new BigDecimal("320.00"),
                        new BigDecimal("120.00"),
                        new BigDecimal("15.00"),
                        45,
                        new HashSet<>(Arrays.asList("All", "Sensitive", "Dry")),
                        Arrays.asList("saponified olive oil", "coconut oil", "lavender essential oil", "roman chamomile extract", "french purple clay"),
                        Arrays.asList("lavender"),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1607006314644-883a48e78550?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_body_oil_citrus",
                        "Wild Bergamot & Sweet Orange Body Glow Oil",
                        "Golden cold-pressed botanical oil delivering instant radiance without greasy residue. [DEMO DATA]",
                        "Bath and Body",
                        new BigDecimal("680.00"),
                        new BigDecimal("260.00"),
                        new BigDecimal("20.00"),
                        30,
                        new HashSet<>(Arrays.asList("All", "Normal", "Dry")),
                        Arrays.asList("jojoba oil", "rosehip seed oil", "bergamot peel oil", "sweet orange essential oil", "vitamin e tocopherol"),
                        Arrays.asList("citrus"),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1608248597359-0091871e4d1f?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_butter_rose",
                        "Whipped Rose & Kokum Butter Soufflé",
                        "Decadent cloud-whipped body moisturizer enriched with indigenous Kokum butter and fresh steam-distilled Damask rose. [DEMO DATA]",
                        "Handmade Skincare",
                        new BigDecimal("540.00"),
                        new BigDecimal("190.00"),
                        new BigDecimal("25.00"),
                        25,
                        new HashSet<>(Arrays.asList("Dry", "Sensitive", "Normal")),
                        Arrays.asList("raw kokum butter", "shea butter", "sweet almond oil", "damask rose floral wax", "vegetable squalane"),
                        Arrays.asList("almond", "nuts", "tree nuts"),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_lip_cardamom",
                        "Raw Shea & Cardamom Nourishing Lip Butter",
                        "Deep restorative barrier hydration infused with warming green cardamom aroma. [DEMO DATA]",
                        "Handmade Skincare",
                        new BigDecimal("220.00"),
                        new BigDecimal("75.00"),
                        new BigDecimal("10.00"),
                        60,
                        new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("unrefined shea butter", "candelilla wax", "virgin coconut oil", "green cardamom essential oil"),
                        Arrays.asList(),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_tool_jade_roller",
                        "Xiuyan Natural Nephrite Jade Facial Roller",
                        "Authentic cooling gemstone roller for lymphatic drainage and facial sculpt ritual. [DEMO DATA]",
                        "Facial Tools",
                        new BigDecimal("490.00"),
                        new BigDecimal("180.00"),
                        new BigDecimal("30.00"),
                        40,
                        new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("100% natural xiuyan nephrite jade stone", "brass hardware"),
                        Arrays.asList(),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        false,
                        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_hydrosol_sandalwood",
                        "Mysore Sandalwood & Damask Rose Hydrosol Mist",
                        "Micro-filtered botanical toner calming inflammation and restoring pH balance. [DEMO DATA]",
                        "Handmade Skincare",
                        new BigDecimal("450.00"),
                        new BigDecimal("160.00"),
                        new BigDecimal("20.00"),
                        35,
                        new HashSet<>(Arrays.asList("Sensitive", "Combination", "Oily", "All")),
                        Arrays.asList("pure santalum album sandalwood distillate", "rosa damascena distillate", "vegetable glycerin"),
                        Arrays.asList(),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_scrub_walnut",
                        "Kashmiri Walnut & Saffron Gentle Polish",
                        "Traditional ubtan exfoliating scrub for radiant smooth skin. [DEMO DATA]",
                        "Handmade Skincare",
                        new BigDecimal("590.00"),
                        new BigDecimal("210.00"),
                        new BigDecimal("20.00"),
                        20,
                        new HashSet<>(Arrays.asList("Oily", "Combination")),
                        Arrays.asList("finely milled walnut shell", "kashmiri saffron stigmas", "chickpea flour", "turmeric extract", "almond meal"),
                        Arrays.asList("walnut", "almond", "nuts", "tree nuts"),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_candle_vanilla",
                        "Artisan Roasted Vanilla & Sandalwood Soy Candle",
                        "Hand-poured 100% soy wax candle with crackling wood wick and cozy botanical notes. [DEMO DATA]",
                        "Personalised Gifts",
                        new BigDecimal("420.00"),
                        new BigDecimal("150.00"),
                        new BigDecimal("25.00"),
                        50,
                        new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("golden soy wax", "vanilla planifolia oil", "mysore sandalwood fragrance oil", "natural wood wick"),
                        Arrays.asList(),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_elixir_kumkumadi",
                        "Golden Saffron & Kumkumadi Radiance Face Elixir",
                        "Precious 16-herb Ayurvedic formulation delivering nocturnal rejuvenation. [DEMO DATA]",
                        "Handmade Skincare",
                        new BigDecimal("950.00"),
                        new BigDecimal("380.00"),
                        new BigDecimal("35.00"),
                        15,
                        new HashSet<>(Arrays.asList("Dry", "Normal", "Mature")),
                        Arrays.asList("kashmiri saffron", "sandalwood oil", "manjistha root", "licorice extract", "sesame seed oil"),
                        Arrays.asList("sesame"),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80"
                ),
                new Product(
                        "prod_salve_calendula",
                        "Unscented Organic Calendula Rescue Salve",
                        "Fragrance-free barrier rescue balm formulated specifically for compromised, reactive, and eczema-prone skin. [DEMO DATA]",
                        "Handmade Skincare",
                        new BigDecimal("380.00"),
                        new BigDecimal("130.00"),
                        new BigDecimal("15.00"),
                        28,
                        new HashSet<>(Arrays.asList("Sensitive", "Dry", "All")),
                        Arrays.asList("calendula officinalis flower infusion", "sunflower seed oil", "candelilla wax", "shea butter"),
                        Arrays.asList(),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80"
                ),
                // OUT OF STOCK product for testing
                new Product(
                        "prod_out_of_stock_elixir",
                        "Cedarwood & Vetiver Night Beard Elixir (OOS Demo)",
                        "Out of stock demo product to verify stock filtering. [DEMO DATA]",
                        "Bath and Body",
                        new BigDecimal("620.00"),
                        new BigDecimal("220.00"),
                        new BigDecimal("20.00"),
                        0, // Out of stock
                        new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("argan oil", "cedarwood oil", "vetiver oil"),
                        Arrays.asList(),
                        IngredientVerificationStatus.VERIFIED,
                        true,
                        true,
                        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80"
                ),
                // UNVERIFIED ingredients product for testing conservative allergy exclusion
                new Product(
                        "prod_unverified_bath_dust",
                        "Artisan Foaming Mineral Bath Dust (Unverified Demo)",
                        "Unverified formulation to test conservative allergy safety exclusion. [DEMO DATA]",
                        "Bath and Body",
                        new BigDecimal("290.00"),
                        new BigDecimal("90.00"),
                        new BigDecimal("15.00"),
                        25,
                        new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("unverified botanical salts", "proprietary scent blend"),
                        Arrays.asList(),
                        IngredientVerificationStatus.UNVERIFIED, // Not verified!
                        true,
                        true,
                        "https://images.unsplash.com/photo-1508759073847-9ca702cec7d2?w=500&auto=format&fit=crop&q=80"
                )
        );

        productRepository.saveAll(demoProducts);
        log.info("Successfully seeded {} demo products for Surreal Treasures.", demoProducts.size());
    }
}
