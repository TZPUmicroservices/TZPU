package tzpu.classRoomservice.JSON;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import tzpu.classRoomservice.Model.ClassroomModel;

import java.io.FileReader;
import java.io.IOException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

public class ClassroomJSON {

    JSONParser jsonParser;
    FileReader reader;
    Object object;
    JSONObject defaultJsonObject;
    JSONObject jsonObject;
    JSONArray jsonArray;

    public List<ClassroomModel> getClassroomModels() {
        return classroomModels;
    }

    List<ClassroomModel> classroomModels;
    public ClassroomJSON() throws IOException, ParseException {
        jsonParser = new JSONParser();
         reader = new FileReader("src/main/java/tzpu/classRoomservice/JSON/files/classroom.json");
         object = jsonParser.parse(reader);
         defaultJsonObject = (JSONObject) object;
         jsonArray = new JSONArray();
         classroomModels = new ArrayList<>();

        jsonArray = (JSONArray) defaultJsonObject.get("classrooms");

        for(int i=0;i<jsonArray.size();i++) {

            jsonObject = (JSONObject) jsonArray.get(i);
            String id = (String) jsonObject.get("id");
            String name = (String) jsonObject.get("name");
            Integer capacity =  Integer.parseInt(jsonObject.get("capacity").toString());
            String classroomType = (String) jsonObject.get("classroomType");
            String availableAfter =  jsonObject.get("availableAfter").toString();
            Integer numberOfComputers = Integer.parseInt(jsonObject.get("numberOfComputers").toString());
            Boolean free = (Boolean) jsonObject.get("free");

            classroomModels.add(new ClassroomModel(id,name,capacity,classroomType,free,Time.valueOf(availableAfter), numberOfComputers));
        }
    }
}
