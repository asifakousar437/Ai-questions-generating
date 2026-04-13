package com.interview.ai.model;

public class InterviewRequest {
    private String skill;
    private String difficulty;
    private String company;

    public InterviewRequest() {}

    public InterviewRequest(String skill, String difficulty, String company) {
        this.skill = skill;
        this.difficulty = difficulty;
        this.company = company;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }
}
