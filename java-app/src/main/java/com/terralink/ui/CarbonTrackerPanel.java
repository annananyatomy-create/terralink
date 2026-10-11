package com.terralink.ui;

import com.terralink.model.ActivityEntry;
import com.terralink.model.CategoryType;
import com.terralink.model.UserProfile;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

/**
 * Java Swing GUI component: Carbon Footprint Budget & Activity Log
 */
public class CarbonTrackerPanel extends JPanel {
    private final UserProfile user;
    private final List<ActivityEntry> activities;
    private final DefaultTableModel tableModel;
    private final JProgressBar budgetBar;
    private final JLabel emittedLabel;
    private final JLabel savedLabel;

    public CarbonTrackerPanel(UserProfile user, List<ActivityEntry> activities, Runnable onLogAction) {
        this.user = user;
        this.activities = activities;

        setLayout(new BorderLayout(16, 16));
        setBackground(new Color(250, 250, 249));
        setBorder(BorderFactory.createEmptyBorder(16, 16, 16, 16));

        // Top Summary Cards
        JPanel metricsPanel = new JPanel(new GridLayout(1, 3, 12, 12));
        metricsPanel.setOpaque(false);

        // Card 1: Budget
        JPanel budgetCard = createMetricCard("Daily Budget (Paris 1.5°C)", "5.0 kg allowance");
        emittedLabel = new JLabel(String.format("%.1f kg emitted", user.getTodayEmittedKg()));
        emittedLabel.setFont(new Font("Monospaced", Font.BOLD, 18));
        budgetCard.add(emittedLabel, BorderLayout.CENTER);

        budgetBar = new JProgressBar(0, 100);
        budgetBar.setValue((int) ((user.getTodayEmittedKg() / user.getDailyBudgetCappedKg()) * 100));
        budgetBar.setForeground(new Color(16, 185, 129));
        budgetCard.add(budgetBar, BorderLayout.SOUTH);
        metricsPanel.add(budgetCard);

        // Card 2: Saved Today
        JPanel savedCard = createMetricCard("Avoided Today", "vs conventional baseline");
        savedLabel = new JLabel(String.format("+%.1f kg CO₂e", user.getTodaySavedKg()));
        savedLabel.setFont(new Font("Monospaced", Font.BOLD, 22));
        savedLabel.setForeground(new Color(4, 120, 87));
        savedCard.add(savedLabel, BorderLayout.CENTER);
        metricsPanel.add(savedCard);

        // Card 3: Streak & Level
        JPanel streakCard = createMetricCard("Climate Streak", "Active consecutive days");
        JLabel streakLabel = new JLabel(user.getStreakDays() + " Days Active");
        streakLabel.setFont(new Font("Monospaced", Font.BOLD, 20));
        streakLabel.setForeground(new Color(180, 83, 9));
        streakCard.add(streakLabel, BorderLayout.CENTER);
        metricsPanel.add(streakCard);

        add(metricsPanel, BorderLayout.NORTH);

        // Table Panel
        JPanel centerPanel = new JPanel(new BorderLayout(8, 8));
        centerPanel.setOpaque(false);

        JPanel tableHeader = new JPanel(new BorderLayout());
        tableHeader.setOpaque(false);
        JLabel title = new JLabel("Recent Carbon Activity Log (DEFRA/IPCC Factors)");
        title.setFont(new Font("SansSerif", Font.BOLD, 14));
        JButton addBtn = new JButton("+ Log Carbon Action");
        addBtn.setBackground(new Color(4, 120, 87));
        addBtn.setForeground(Color.WHITE);
        addBtn.setFocusPainted(false);
        addBtn.addActionListener(e -> onLogAction.run());
        tableHeader.add(title, BorderLayout.WEST);
        tableHeader.add(addBtn, BorderLayout.EAST);
        centerPanel.add(tableHeader, BorderLayout.NORTH);

        String[] columns = {"Activity", "Category", "Timestamp", "Emitted (kg)", "Avoided (kg)", "XP Earned"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        for (ActivityEntry act : activities) {
            tableModel.addRow(new Object[]{
                    act.getTitle(),
                    act.getCategory().getDisplayName(),
                    act.getTimestamp(),
                    String.format("%.2f", act.getEmittedKg()),
                    String.format("+%.2f", act.getSavedKg()),
                    "+" + act.getXpEarned()
            });
        }

        JTable table = new JTable(tableModel);
        table.setRowHeight(32);
        table.setFont(new Font("SansSerif", Font.PLAIN, 12));
        table.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 12));
        centerPanel.add(new JScrollPane(table), BorderLayout.CENTER);

        add(centerPanel, BorderLayout.CENTER);
    }

    private JPanel createMetricCard(String title, String subtitle) {
        JPanel card = new JPanel(new BorderLayout(6, 6));
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(229, 231, 235)),
                BorderFactory.createEmptyBorder(12, 12, 12, 12)
        ));
        JLabel header = new JLabel(title);
        header.setFont(new Font("SansSerif", Font.BOLD, 12));
        header.setForeground(new Color(75, 85, 99));
        JLabel sub = new JLabel(subtitle);
        sub.setFont(new Font("SansSerif", Font.PLAIN, 10));
        sub.setForeground(new Color(156, 163, 175));
        JPanel top = new JPanel(new GridLayout(2, 1));
        top.setOpaque(false);
        top.add(header);
        top.add(sub);
        card.add(top, BorderLayout.NORTH);
        return card;
    }

    public void addEntryToTable(ActivityEntry entry) {
        tableModel.insertRow(0, new Object[]{
                entry.getTitle(),
                entry.getCategory().getDisplayName(),
                entry.getTimestamp(),
                String.format("%.2f", entry.getEmittedKg()),
                String.format("+%.2f", entry.getSavedKg()),
                "+" + entry.getXpEarned()
        });
        emittedLabel.setText(String.format("%.1f kg emitted", user.getTodayEmittedKg()));
        savedLabel.setText(String.format("+%.1f kg CO₂e", user.getTodaySavedKg()));
        budgetBar.setValue((int) ((user.getTodayEmittedKg() / user.getDailyBudgetCappedKg()) * 100));
    }
}
