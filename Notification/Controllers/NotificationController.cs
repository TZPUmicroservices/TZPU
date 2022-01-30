using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Notification.HubConfig;

namespace Notification.Controllers
{
    class Student
    {
        public int index;
        public string cas;
    }
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private List<Student> studenti;
        private List<int> indeksi;
        private IHubContext<NotificationHub> _hub;
        public NotificationController(IHubContext<NotificationHub> hub)
        {
            _hub = hub;
        }
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }
        [HttpGet]
        [Route("Notify")]
        public async Task<IActionResult> Notify(string studenti_index,string text)
        {
            indeksi = JsonConvert.DeserializeObject<List<int>>(studenti_index);
            foreach (int index in indeksi)
            {
                await _hub.Clients.All.SendAsync("I" + index.ToString(), text);
            }
            return Ok();
        }
        [HttpGet]
        [Route("Failure")]
        public async Task<IActionResult> Failure(string studenti_index, string text)
        {
            Console.WriteLine(text);
            studenti = JsonConvert.DeserializeObject<List<Student>>(studenti_index);
            foreach (Student index in studenti)
            {
                await _hub.Clients.All.SendAsync("N"+index.index.ToString(), text);
            }
            return Ok(new { Message =text });
        }
    }
}
