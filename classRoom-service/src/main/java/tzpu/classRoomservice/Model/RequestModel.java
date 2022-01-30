package tzpu.classRoomservice.Model;

public class RequestModel {

    private String requestId;
    private int studentNumber;
    private String courseName;
    private String typeOfClass;

    public RequestModel(String requestId, int studentNumber,String courseName, String typeOfClass) {
        this.requestId = requestId;
        this.studentNumber = studentNumber;
        this.courseName = courseName;
        this.typeOfClass = typeOfClass;
    }

    public String getRequestId() {
        return requestId;
    }

    public int getStudentNumber() {
        return studentNumber;
    }

    public String getTypeOfClass() {
        return typeOfClass;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public RequestModel() {

    }
}
