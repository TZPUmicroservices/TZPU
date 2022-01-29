using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Notification.HubConfig;

namespace PowerFailure.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PowerFailureController : ControllerBase
    {

        List<int> studenti;
        private IHubContext<PowerFailureHub> _hub;
        public PowerFailureController(IHubContext<PowerFailureHub> hub)
        {
            _hub = hub;
        }
        [HttpGet]
        [Route("NedostupnaUcionica")]
        public async Task<IActionResult> NedostupnaUcionica(string ucionica,int time)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://100.71.13.58:8081/Predmet/Prosek/AOR");
            
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                string rez = reader.ReadToEnd();
                string[] par = rez.Split("|");
                //string ss = "[1,2,3,33,22,11]";
                studenti= JsonConvert.DeserializeObject<List<int>>(par[0]);
                HttpWebRequest Notifyrequest = (HttpWebRequest)WebRequest.Create("http://localhost:5000/Notification/Failure?studenti_index="+ par[0] + "&text="+ "Predmet" + rez[1] + " ce se odrzati u ucionici " + rez[2]);
                Notifyrequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
                using (HttpWebResponse response1 = (HttpWebResponse)Notifyrequest.GetResponse())
                { 
                    return Ok(studenti);
                }
            }
        }
        [HttpGet]
        [Route("OdloziSve")]
        public async Task<IActionResult> OdloziSve(int time)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://100.71.13.58:8081/Predmet/Prosek/AOR");
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                string rez = reader.ReadToEnd();
                //string ss = "[1,2,3,33,22,11]";
                studenti = JsonConvert.DeserializeObject<List<int>>(rez);
                HttpWebRequest Notifyrequest = (HttpWebRequest)WebRequest.Create("http://localhost:5000/Notification/Failure?studenti_index=" + rez + "&text=" + "Predavanja se odlazu " + time + " minuta");
                Notifyrequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
                using (HttpWebResponse response1 = (HttpWebResponse)Notifyrequest.GetResponse())
                {
                    return Ok(studenti);
                }
            }
            
        }
        [HttpGet]
        [Route("OdloziNaNeodredjenoVreme")]
        public async Task<IActionResult> OdloziNaNeodredjenoVreme()
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://100.71.13.58:8081/Predmet/Prosek/AOR");
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                string rez = reader.ReadToEnd();
                //string ss = "[1,2,3,33,22,11]";
                studenti = JsonConvert.DeserializeObject<List<int>>(rez);
                HttpWebRequest Notifyrequest = (HttpWebRequest)WebRequest.Create("http://localhost:5000/Notification/Failure?studenti_index=" + rez + "&text=" + "Sva predavanja se odlazu");
                Notifyrequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
                using (HttpWebResponse response1 = (HttpWebResponse)Notifyrequest.GetResponse())
                {
                    return Ok(studenti);
                }
            }
        }
    }
}
