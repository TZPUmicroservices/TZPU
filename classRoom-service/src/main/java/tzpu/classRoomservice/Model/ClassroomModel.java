package tzpu.classRoomservice.Model;

import java.sql.Time;



public class ClassroomModel {
    private String id;
    private String name;
    private int capacity;
    private String classroomType;
    private boolean isFree;
    private Time availableAfter;
    private int numberOfComputers;


    public ClassroomModel(String id, String name, int capacity, String classroomType, boolean isFree, Time availableAfter, int numberOfComputers) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.classroomType = classroomType;
        this.isFree = isFree;
        this.availableAfter = availableAfter;
        this.numberOfComputers = numberOfComputers;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getCapacity() {
        return capacity;
    }

    public String getClassroomType() {
        return classroomType;
    }

    public boolean isFree() {
        return isFree;
    }

    public Time getAvailableAfter() {
        return availableAfter;
    }

    public int getNumberOfComputers() {
        return numberOfComputers;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void setClassroomType(String classroomType) {
        this.classroomType = classroomType;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public void setAvailableAfter(Time availableAfter) {
        this.availableAfter = availableAfter;
    }

    public void setNumberOfComputers(int numberOfComputers) {
        this.numberOfComputers = numberOfComputers;
    }

}
