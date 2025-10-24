package com.leavemanagement.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "hr_policy")
public class HRPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Policy name/title
    private String fileName; // File name stored in folder
    private String fileType; // .docx or .pdf

    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadedDate;

    public HRPolicy() {}

    public HRPolicy(String name, String fileName, String fileType, Date uploadedDate) {
        this.name = name;
        this.fileName = fileName;
        this.fileType = fileType;
        this.uploadedDate = uploadedDate;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Date getUploadedDate() { return uploadedDate; }
    public void setUploadedDate(Date uploadedDate) { this.uploadedDate = uploadedDate; }
}
