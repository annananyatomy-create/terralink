package com.terralink;

import com.terralink.model.*;
import com.terralink.ui.BiomeCanvasPanel;
import com.terralink.ui.CarbonTrackerPanel;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Terralink SDG Climate Action & Community Eco-Tracker
 * Main Java Desktop Application entry point.
 */
public class TerralinkApp extends JFrame {
    private final UserProfile user;
    private final List<ActivityEntry> activities;
    private CarbonTrackerPanel carbonPanel;
    private BiomeCanvasPanel biomePanel;

    public TerralinkApp() {
        super("Terralink · SDG Climate Action & Community Eco-Tracker");
        this.user = new UserProfile("Alex Chen", "@alexc_climate", "Riverside Eco-Quarter");
        this.activities = new ArrayList<>();

        seedInitialData();
        initUI();
    }

    private void seedInitialData() {
        activities.add(new ActivityEntry(
                "1", CategoryType.TRANSIT, "Metro Commute to Work (Line 2)",
                "14 km commute via electrified light rail instead of solo drive",
                0.39, 2.39, 2.0, 50, "Metro / Light Rail", 14.0
        ));
        activities.add(new ActivityEntry(
                "2", CategoryType.DIET, "Organic Lentil & Grain Bowl",
                "Zero-mile local legume meal from Green Market Co-op",
                0.45, 2.25, 1.8, 45, "Plant-Based / Vegan Meal", null
        ));
        activities.add(new ActivityEntry(
                "3", CategoryType.TRANSIT, "CityBike share errand",
                "3.5 km pedal errand on protected cycleway",
                0.0, 0.6, 0.6, 25, "Bikeshare / Bicycle", 3.5
        ));
    }

    private void initUI() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1100, 780);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Header Navigation
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(Color.WHITE);
        header.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(229, 231, 235)));
        header.setPreferredSize(new Dimension(1100, 60));

        JLabel brand = new JLabel("  🌿 Terralink  [SDG 13 · 11 · 12]");
        brand.setFont(new Font("SansSerif", Font.BOLD, 18));
        brand.setForeground(new Color(4, 120, 87));
        header.add(brand, BorderLayout.WEST);

        JPanel rightHeader = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 14));
        rightHeader.setOpaque(false);
        JLabel streak = new JLabel("🔥 " + user.getStreakDays() + "d Streak  ");
        streak.setFont(new Font("SansSerif", Font.BOLD, 13));
        streak.setForeground(new Color(180, 83, 9));
        rightHeader.add(streak);

        JButton logBtn = new JButton("+ Log Carbon Action");
        logBtn.setBackground(new Color(4, 120, 87));
        logBtn.setForeground(Color.WHITE);
        logBtn.setFocusPainted(false);
        logBtn.addActionListener(e -> openLogActionDialog());
        rightHeader.add(logBtn);

        header.add(rightHeader, BorderLayout.EAST);
        add(header, BorderLayout.NORTH);

        // Tabbed Pane for Views
        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.setFont(new Font("SansSerif", Font.BOLD, 12));

        // 1. Dashboard Tab (Biome + Carbon Tracker)
        JPanel dashboardTab = new JPanel(new BorderLayout());
        biomePanel = new BiomeCanvasPanel(user);
        carbonPanel = new CarbonTrackerPanel(user, activities, this::openLogActionDialog);
        dashboardTab.add(biomePanel, BorderLayout.NORTH);
        dashboardTab.add(carbonPanel, BorderLayout.CENTER);
        tabbedPane.addTab("Dashboard", dashboardTab);

        // 2. Transit Network Tab
        tabbedPane.addTab("Transit Network", createTransitTab());

        // 3. Local Alternatives Tab
        tabbedPane.addTab("Local Alternatives", createAlternativesTab());

        // 4. Community Challenge Tab
        tabbedPane.addTab("Community Leaderboard", createCommunityTab());

        add(tabbedPane, BorderLayout.CENTER);
    }

    private JPanel createTransitTab() {
        JPanel p = new JPanel(new BorderLayout(16, 16));
        p.setBackground(new Color(250, 250, 249));
        p.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JLabel lbl = new JLabel("Municipal Transit System Integration & Route Carbon Comparison");
        lbl.setFont(new Font("SansSerif", Font.BOLD, 16));
        p.add(lbl, BorderLayout.NORTH);

        String[] cols = {"Route Mode", "Duration", "Distance", "Cost", "Emissions", "Avoided CO₂e"};
        Object[][] data = {
                {"Metro Blue Line Express", "16 mins", "8.4 km", "$2.25", "0.24 kg", "+1.20 kg CO₂e"},
                {"CityBike Share Greenway", "22 mins", "7.8 km", "$1.50", "0.00 kg", "+1.33 kg CO₂e"},
                {"BRT Electric Bus 4", "19 mins", "8.6 km", "$1.75", "0.29 kg", "+1.18 kg CO₂e"},
                {"Gasoline Car (Solo)", "24 mins", "8.9 km", "$6.80", "1.52 kg", "0.00 kg"}
        };
        JTable table = new JTable(data, cols);
        table.setRowHeight(36);
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private JPanel createAlternativesTab() {
        JPanel p = new JPanel(new BorderLayout(16, 16));
        p.setBackground(new Color(250, 250, 249));
        p.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JLabel lbl = new JLabel("Sustainable Local Alternatives & Circular Community Hubs (SDG 12)");
        lbl.setFont(new Font("SansSerif", Font.BOLD, 16));
        p.add(lbl, BorderLayout.NORTH);

        String[] cols = {"Hub Name", "Category", "Neighborhood", "Avg Savings", "Action"};
        Object[][] data = {
                {"The Living Jar Bulk Refill", "Bulk Refill", "Riverside Eco-Quarter", "~1.6 kg CO₂e", "Log Pantry Refill"},
                {"Mend & Spark Repair Cafe", "Circular Repair", "Civic Commons", "~12.5 kg CO₂e", "Log Item Fixed"},
                {"Sunstone Urban Farm CSA", "Local Food", "Waterfront District", "~2.2 kg CO₂e", "Log Farm Box"},
                {"Spoke & Chain Bike Co-op", "Bikeshare / Cargo", "University Heights", "~4.1 kg CO₂e", "Log Cargo Run"},
                {"SoilCycle Compost Hub", "Composting", "Riverside Eco-Quarter", "~1.1 kg CO₂e", "Log Scraps Drop"}
        };
        JTable table = new JTable(data, cols);
        table.setRowHeight(36);
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private JPanel createCommunityTab() {
        JPanel p = new JPanel(new BorderLayout(16, 16));
        p.setBackground(new Color(250, 250, 249));
        p.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JPanel top = new JPanel(new GridLayout(2, 1, 6, 6));
        top.setOpaque(false);
        JLabel title = new JLabel("The 10-Ton Community Carbon Drop Challenge (SDG 13.2)");
        title.setFont(new Font("SansSerif", Font.BOLD, 16));
        JProgressBar goalBar = new JProgressBar(0, 100);
        goalBar.setValue(68);
        goalBar.setStringPainted(true);
        goalBar.setString("6,840 / 10,000 kg CO₂e Avoided (68% Complete · 342 Neighbors)");
        top.add(title);
        top.add(goalBar);
        p.add(top, BorderLayout.NORTH);

        String[] cols = {"Rank", "Neighbor", "Neighborhood", "Streak", "Weekly Avoided", "Top Habit"};
        Object[][] data = {
                {"#1", "Marcus Vance", "Downtown Midtown", "14 days", "+26.8 kg", "Daily 16km Bikeshare"},
                {"#2", "Elena Rostova", "Riverside Eco-Quarter", "11 days", "+22.4 kg", "Repair Cafe Lead"},
                {"#3", "Alex Chen (You)", "Riverside Eco-Quarter", "9 days", "+18.5 kg", "Light Rail Commute"},
                {"#4", "Sarah Kim", "University Heights", "8 days", "+18.2 kg", "Plant-Based Dining"}
        };
        JTable table = new JTable(data, cols);
        table.setRowHeight(36);
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private void openLogActionDialog() {
        String[] options = {
                "Metro Commute 12 km (Saves +1.71 kg CO₂e)",
                "Plant-Based Lunch (Saves +1.78 kg CO₂e)",
                "Bikeshare 6 km (Saves +1.02 kg CO₂e)",
                "Bulk Refill Pantry (Saves +1.50 kg CO₂e)",
                "Repair Cafe Item Fix (Saves +13.70 kg CO₂e)"
        };

        String selected = (String) JOptionPane.showInputDialog(
                this,
                "Select a sustainable action to calculate emission savings:",
                "Log Carbon Action",
                JOptionPane.QUESTION_MESSAGE,
                null,
                options,
                options[0]
        );

        if (selected != null) {
            double saved = selected.contains("13.70") ? 13.70 :
                    selected.contains("1.71") ? 1.71 :
                            selected.contains("1.78") ? 1.78 :
                                    selected.contains("1.02") ? 1.02 : 1.50;
            double emitted = 0.2;
            int xp = (int) (saved * 25);

            user.addActivity(emitted, saved, xp);
            ActivityEntry entry = new ActivityEntry(
                    String.valueOf(System.currentTimeMillis()),
                    selected.contains("Metro") ? CategoryType.TRANSIT :
                            selected.contains("Plant") ? CategoryType.DIET : CategoryType.CONSUMPTION,
                    selected.split("\\(")[0].trim(),
                    "Logged via Terralink Java action engine",
                    emitted, emitted + saved, saved, xp, "Sustainable Mode", null
            );
            activities.add(0, entry);
            carbonPanel.addEntryToTable(entry);
            biomePanel.repaint();

            JOptionPane.showMessageDialog(
                    this,
                    String.format("Recorded! +%.2f kg CO₂e avoided (+%d XP)!", saved, xp),
                    "Action Verified",
                    JOptionPane.INFORMATION_MESSAGE
            );
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}
            new TerralinkApp().setVisible(true);
        });
    }
}
