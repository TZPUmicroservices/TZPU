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
    class Student
    {
        public int index;
        public string cas;
    }
    [ApiController]
    [Route("[controller]")]
    public class PowerFailureController : ControllerBase
    {

        List<Student> studenti;
        private IHubContext<PowerFailureHub> _hub;
        public PowerFailureController(IHubContext<PowerFailureHub> hub)
        {
            _hub = hub;
        }
        [HttpGet]
        [Route("NedostupnaUcionica")]
        public async Task<IActionResult> NedostupnaUcionica(string ucionica,int time)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://100.109.130.74:3500/classroompoweroff?name="+ucionica+"&time="+time);
            
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                string rez =reader.ReadToEnd();
                studenti= JsonConvert.DeserializeObject<List<Student>>(rez);
                if (studenti.Count != 0)
                {
                    HttpWebRequest Notifyrequest = (HttpWebRequest)WebRequest.Create("https://localhost:44344/api/Notification/Failure?studenti_index=" + rez + "&text=" + "Predmet " + studenti[0].cas + " se odlaze za " + time + " minuta");
                    Notifyrequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
                    using (HttpWebResponse response1 = (HttpWebResponse)Notifyrequest.GetResponse())
                    {
                        return Ok(studenti);
                    }
                }
                return BadRequest();
            }
        }
        [HttpGet]
        [Route("ObavestiSveStudente")]
        public async Task<IActionResult> ObavestiSveStudente(string poruka)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://100.109.130.74:3500/importantnotify");
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                string rez = reader.ReadToEnd();
                HttpWebRequest Notifyrequest = (HttpWebRequest)WebRequest.Create("https://localhost:44344/api/Notification/Notify?studenti_index=" + rez + "&text=" + poruka);
                Notifyrequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
                using (HttpWebResponse response1 = (HttpWebResponse)Notifyrequest.GetResponse())
                {
                    return Ok(rez);
                }
            }
            
        }
        [HttpGet]
        [Route("OdloziNaNeodredjenoVreme")]
        public async Task<IActionResult> OdloziNaNeodredjenoVreme()
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://100.109.130.74:3500/importantnotify");
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                string rez = reader.ReadToEnd();
                //string ss = "[1,2,3,33,22,11]";
                studenti = JsonConvert.DeserializeObject<List<Student>>(rez);
                HttpWebRequest Notifyrequest = (HttpWebRequest)WebRequest.Create("http://localhost:5000/api/Notification/Failure?studenti_index=" + rez + "&text=" + "Sva predavanja se odlazu");
                Notifyrequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
                using (HttpWebResponse response1 = (HttpWebResponse)Notifyrequest.GetResponse())
                {
                    return Ok(studenti);
                }
            }
        }
    }
}
