//this is a only for demo purposes
package com.studentmanagement.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "STAFF")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer staffId;

    public Staff() {
    }

    public Integer getStaffId() {
        return staffId;
    }

    public void setStaffId(Integer staffId) {
        this.staffId = staffId;
    }
}