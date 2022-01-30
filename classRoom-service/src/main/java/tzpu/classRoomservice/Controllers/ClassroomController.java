package tzpu.classRoomservice.Controllers;

import org.json.simple.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import tzpu.classRoomservice.JSON.ClassroomJSON;
import tzpu.classRoomservice.Model.ClassroomModel;
import tzpu.classRoomservice.Model.RequestModel;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RequestMapping("/classroomController")
@Controller
public class ClassroomController {

    List<ClassroomModel> classroomModelList = new ArrayList<>();
    ClassroomJSON classroomJSON = new ClassroomJSON();
    //List<RequestModel> requestModels;
    List<RequestModel> requestReciever = new ArrayList<>();
    List<RequestModel> requestModels = new ArrayList<>();

    public ClassroomController() throws IOException, ParseException {
        classroomModelList = classroomJSON.getClassroomModels();
    }

    @RequestMapping("/view")
    String getView(Model model) throws IOException, ParseException {


        model.addAttribute("listA",classroomModelList);
        model.addAttribute("requestList",requestModels);

        return "ClassroomPage";
    }

    @ResponseBody
    @GetMapping("/getRequest")
    public List<RequestModel> getModel() throws IOException, ParseException {
        return requestModels;
    }

    @ResponseBody
    @PostMapping("/sendRequest")
    public List<RequestModel> SendRequest(@RequestBody RequestModel requestModel) {

        requestModels.add(new RequestModel(requestModel.getRequestId(),requestModel.getStudentNumber(),requestModel.getCourseName(),requestModel.getTypeOfClass()));
        return requestModels;
    }
    @ResponseBody
    @DeleteMapping(value = "/deleteElement")
    public ResponseEntity<String> deletePost(@RequestParam(value="requestId") String requestId,@RequestParam(value="courseName") String courseName) {

        RequestModel rm;
        boolean isRemoved = false;
        for(int i=0;i<requestModels.size();i++)
        {
            if(requestModels.get(i).getRequestId() == requestId && requestModels.get(i).getCourseName()==courseName)
            {
                requestModels.remove(i);
                isRemoved = true;
            }
        }

        if (!isRemoved) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(requestId, HttpStatus.OK);
    }





}
